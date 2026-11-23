import { after, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  sendContactMessageEmail,
  isSmtpConfigured,
  type SmtpConfig,
} from '@/lib/contact-mailer';
import { getPhoneNumberLengthRuleByDialCode } from '@/lib/country-codes';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const maxDuration = 60;

const DEFAULT_SITE_EMAIL = 'contact@lunacaftan.com';
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 255;
const MAX_PHONE_COUNTRY_CODE_LENGTH = 6;
const MAX_PHONE_NUMBER_LENGTH = 15;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_INQUIRY_PRODUCT_ID_LENGTH = 40;
const MAX_INQUIRY_PRODUCT_NAME_LENGTH = 255;
const SUCCESS_MESSAGE_KEY = 'contact.form.success';
const ERROR_MESSAGE_KEY = 'contact.form.error';
const SERVICE_UNAVAILABLE_MESSAGE_KEY = 'contact.form.serviceUnavailable';
const PHONE_LENGTH_BY_COUNTRY_ERROR_KEY = 'contact.form.phoneNumberLengthByCountryInvalid';
const SMTP_SETTING_KEYS = [
  'smtp_host',
  'smtp_port',
  'smtp_user',
  'smtp_pass',
  'smtp_from',
] as const;
const RETRYABLE_DB_ERROR_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);
const DB_RETRY_ATTEMPTS = 2;
const DB_RETRY_DELAY_MS = 300;
const DELIVERY_CONFIG_CACHE_TTL_MS = 30_000;

type ContactDeliveryConfig = {
  adminEmail: string;
  smtpConfig: SmtpConfig;
};
type ContactInquiryType = 'GENERAL' | 'CAFTAN';

let deliveryConfigCache: { value: ContactDeliveryConfig; expiresAt: number } | null = null;

const normalizeString = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const normalizePhoneCountryCode = (value: unknown) => {
  const compact = normalizeString(value).replace(/[^\d+]/g, '');
  if (!compact) return '';
  return compact.startsWith('+') ? compact : `+${compact}`;
};

const normalizePhoneNumber = (value: unknown) =>
  normalizeString(value).replace(/[^\d]/g, '');

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const isDatabaseUnavailableError = (error: unknown) => {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code?: unknown }).code ?? '');
    if (RETRYABLE_DB_ERROR_CODES.has(code)) {
      return true;
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("can't reach database server") ||
      message.includes('database server') ||
      message.includes('timed out')
    );
  }

  return false;
};

const withDatabaseRetry = async <T>(operation: () => Promise<T>) => {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= DB_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const shouldRetry = isDatabaseUnavailableError(error) && attempt < DB_RETRY_ATTEMPTS;
      if (!shouldRetry) {
        throw error;
      }

      await sleep(DB_RETRY_DELAY_MS * attempt);
    }
  }

  throw lastError;
};

const getFallbackDeliveryConfig = (): ContactDeliveryConfig => ({
  adminEmail: normalizeString(process.env.CONTACT_EMAIL) || DEFAULT_SITE_EMAIL,
  smtpConfig: {},
});

const getContactDeliveryConfig = async (): Promise<ContactDeliveryConfig> => {
  const now = Date.now();
  if (deliveryConfigCache && deliveryConfigCache.expiresAt > now) {
    return deliveryConfigCache.value;
  }

  try {
    const settings = await withDatabaseRetry(() =>
      prisma.settings.findMany({
        where: {
          key: {
            in: ['email', ...SMTP_SETTING_KEYS],
          },
        },
        select: {
          key: true,
          value: true,
        },
      })
    );

    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    const adminEmail = normalizeString(settingsMap.email) || DEFAULT_SITE_EMAIL;
    const smtpHost = normalizeString(settingsMap.smtp_host);
    const smtpPort = normalizeString(settingsMap.smtp_port);
    const smtpUser = normalizeString(settingsMap.smtp_user);
    const smtpPass = normalizeString(settingsMap.smtp_pass);
    const smtpFrom = normalizeString(settingsMap.smtp_from);
    const smtpConfig: SmtpConfig = {
      host: smtpHost || undefined,
      port: smtpPort || undefined,
      user: smtpUser || undefined,
      pass: smtpPass || undefined,
      from: smtpFrom || undefined,
    };

    const value: ContactDeliveryConfig = { adminEmail, smtpConfig };
    deliveryConfigCache = {
      value,
      expiresAt: now + DELIVERY_CONFIG_CACHE_TTL_MS,
    };
    return value;
  } catch (error) {
    console.error('Failed to load contact delivery settings from DB, using fallback config:', error);
    if (deliveryConfigCache) {
      return deliveryConfigCache.value;
    }
    return getFallbackDeliveryConfig();
  }
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhoneCountryCode = (value: string) =>
  /^\+[1-9]\d{0,4}$/.test(value);
const isValidPhoneNumber = (value: string) =>
  /^\d{5,15}$/.test(value);

const queueContactEmailDelivery = (params: {
  id: string;
  createdAt: Date;
  adminEmail: string;
  smtpConfig: SmtpConfig;
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  message: string;
  inquiryType: ContactInquiryType;
  inquiryProductId: string | null;
  inquiryProductName: string | null;
  inquiryProductNameEn: string | null;
}) => {
  after(async () => {
    const smtpConfigured = isSmtpConfigured(params.smtpConfig);
    let emailSent = false;
    let emailError: string | null = null;

    if (smtpConfigured) {
      try {
        await sendContactMessageEmail({
          toEmail: params.adminEmail,
          siteEmail: params.adminEmail,
          visitorName: params.name,
          visitorEmail: params.email,
          visitorPhoneCountryCode: params.phoneCountryCode,
          visitorPhoneNumber: params.phoneNumber,
          visitorMessage: params.message,
          inquiryType: params.inquiryType,
          inquiryProductId: params.inquiryProductId,
          inquiryProductName: params.inquiryProductName,
          inquiryProductNameEn: params.inquiryProductNameEn,
          messageId: params.id,
          createdAt: params.createdAt,
        }, params.smtpConfig);
        emailSent = true;
      } catch (error) {
        console.error('Error sending contact email:', error);
        emailError = error instanceof Error ? error.message : 'Failed to send email';
      }
    } else {
      emailError = 'SMTP is not configured';
    }

    try {
      await withDatabaseRetry(() =>
        prisma.contactMessage.update({
          where: { id: params.id },
          data: emailSent
            ? {
                status: 'SENT',
                emailSentAt: new Date(),
                emailError: null,
              }
            : {
                status: 'FAILED',
                emailError,
              },
        })
      );
    } catch (error) {
      console.error('Error updating contact message status in DB:', error);
    }
  });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = normalizeString(body.name);
    const email = normalizeString(body.email).toLowerCase();
    const phoneCountryCode = normalizePhoneCountryCode(body.phoneCountryCode);
    const phoneNumber = normalizePhoneNumber(body.phoneNumber);
    const message = normalizeString(body.message);
    const inquiryTypeInput = normalizeString(body.inquiryType).toUpperCase();
    const inquiryType: ContactInquiryType = inquiryTypeInput
      ? (inquiryTypeInput as ContactInquiryType)
      : 'GENERAL';
    const inquiryProductIdInput = normalizeString(body.inquiryProductId);

    if (inquiryType !== 'GENERAL' && inquiryType !== 'CAFTAN') {
      return NextResponse.json(
        { errorKey: 'contact.form.inquiryTypeInvalid' },
        { status: 400 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { errorKey: 'contact.form.validationRequired' },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { errorKey: 'contact.form.nameTooLong' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email) || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { errorKey: 'contact.form.emailInvalid' },
        { status: 400 }
      );
    }

    if (!phoneCountryCode) {
      return NextResponse.json(
        { errorKey: 'contact.form.phoneCountryCodeRequired' },
        { status: 400 }
      );
    }

    if (!isValidPhoneCountryCode(phoneCountryCode) || phoneCountryCode.length > MAX_PHONE_COUNTRY_CODE_LENGTH) {
      return NextResponse.json(
        { errorKey: 'contact.form.phoneCountryCodeInvalid' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { errorKey: 'contact.form.phoneNumberRequired' },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(phoneNumber) || phoneNumber.length > MAX_PHONE_NUMBER_LENGTH) {
      return NextResponse.json(
        { errorKey: 'contact.form.phoneNumberInvalid' },
        { status: 400 }
      );
    }

    const { minLength: phoneMinLength, maxLength: phoneMaxLength } =
      getPhoneNumberLengthRuleByDialCode(phoneCountryCode);
    if (phoneNumber.length < phoneMinLength || phoneNumber.length > phoneMaxLength) {
      return NextResponse.json(
        {
          errorKey: PHONE_LENGTH_BY_COUNTRY_ERROR_KEY,
        },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { errorKey: 'contact.form.messageTooLong' },
        { status: 400 }
      );
    }

    let inquiryProductId: string | null = null;
    let inquiryProductName: string | null = null;
    let inquiryProductNameEn: string | null = null;

    if (inquiryType === 'CAFTAN') {
      if (!inquiryProductIdInput) {
        return NextResponse.json(
          { errorKey: 'contact.form.caftanRequired' },
          { status: 400 }
        );
      }

      if (inquiryProductIdInput.length > MAX_INQUIRY_PRODUCT_ID_LENGTH) {
        return NextResponse.json(
          { errorKey: 'contact.form.caftanInvalid' },
          { status: 400 }
        );
      }

      const selectedProduct = await withDatabaseRetry(() =>
        prisma.product.findUnique({
          where: { id: inquiryProductIdInput },
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        })
      );

      if (!selectedProduct) {
        return NextResponse.json(
          { errorKey: 'contact.form.caftanInvalid' },
          { status: 400 }
        );
      }

      inquiryProductId = selectedProduct.id;
      inquiryProductName = normalizeString(selectedProduct.name).slice(0, MAX_INQUIRY_PRODUCT_NAME_LENGTH) || null;
      inquiryProductNameEn =
        normalizeString(selectedProduct.nameEn).slice(0, MAX_INQUIRY_PRODUCT_NAME_LENGTH) || null;
    }

    const { adminEmail, smtpConfig } = await getContactDeliveryConfig();

    const savedMessage = await withDatabaseRetry(() =>
      prisma.contactMessage.create({
        data: {
          name,
          email,
          phoneCountryCode,
          phoneNumber,
          message,
          inquiryType,
          inquiryProductId,
          inquiryProductName,
          inquiryProductNameEn,
          adminEmail,
        },
        select: {
          id: true,
          createdAt: true,
        },
      })
    );

    queueContactEmailDelivery({
      id: savedMessage.id,
      createdAt: savedMessage.createdAt,
      adminEmail,
      smtpConfig,
      name,
      email,
      phoneCountryCode,
      phoneNumber,
      message,
      inquiryType,
      inquiryProductId,
      inquiryProductName,
      inquiryProductNameEn,
    });

    return NextResponse.json(
      {
        messageKey: SUCCESS_MESSAGE_KEY,
        id: savedMessage.id,
        emailQueued: true,
        storedInDatabase: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact message:', error);

    if (isDatabaseUnavailableError(error)) {
      return NextResponse.json(
        { errorKey: SERVICE_UNAVAILABLE_MESSAGE_KEY },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { errorKey: ERROR_MESSAGE_KEY },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const withStats = searchParams.get('withStats') !== 'false';
    const takeParam = Number.parseInt(searchParams.get('take') || '80', 10);
    const take = Number.isNaN(takeParam) ? 80 : Math.min(Math.max(takeParam, 1), 150);

    const where = unreadOnly ? { read: false } : {};

    const messages = await withDatabaseRetry(() =>
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        select: {
          id: true,
          name: true,
          email: true,
          phoneCountryCode: true,
          phoneNumber: true,
          message: true,
          inquiryType: true,
          inquiryProductId: true,
          inquiryProductName: true,
          inquiryProductNameEn: true,
          adminEmail: true,
          status: true,
          emailError: true,
          emailSentAt: true,
          read: true,
          readAt: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    );

    if (!withStats) {
      return NextResponse.json({
        messages,
        stats: {
          total: messages.length,
          unread: messages.filter((item) => !item.read).length,
          sent: messages.filter((item) => item.status === 'SENT').length,
          failed: messages.filter((item) => item.status === 'FAILED').length,
        },
      });
    }

    let total = 0;
    let unread = 0;
    let sent = 0;
    let failed = 0;

    try {
      total = await withDatabaseRetry(() => prisma.contactMessage.count());
      unread = await withDatabaseRetry(() =>
        prisma.contactMessage.count({ where: { read: false } })
      );
      const groupedByStatus = await withDatabaseRetry(() =>
        prisma.contactMessage.groupBy({
          by: ['status'],
          _count: {
            _all: true,
          },
        })
      );

      for (const item of groupedByStatus) {
        if (item.status === 'SENT') sent = item._count._all;
        if (item.status === 'FAILED') failed = item._count._all;
      }
    } catch (statsError) {
      console.error('Error fetching contact message stats, using response-local fallback:', statsError);
      total = messages.length;
      unread = messages.filter((item) => !item.read).length;
      sent = messages.filter((item) => item.status === 'SENT').length;
      failed = messages.filter((item) => item.status === 'FAILED').length;
    }

    return NextResponse.json({
      messages,
      stats: {
        total,
        unread,
        sent,
        failed,
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'فشل تحميل الرسائل' },
      { status: 500 }
    );
  }
}
