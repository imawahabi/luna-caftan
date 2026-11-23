import nodemailer from 'nodemailer';
import { access } from 'fs/promises';
import path from 'path';

const DEFAULT_FROM_NAME = 'Luna Caftan';
const INLINE_LOGO_CID = 'luna-logo-cid';
const INLINE_LOGO_PATH = path.join(process.cwd(), 'public', 'logo-white.png');
let cachedLogoAvailable: boolean | null = null;

interface ContactEmailPayload {
  toEmail: string;
  siteEmail: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhoneCountryCode: string;
  visitorPhoneNumber: string;
  visitorMessage: string;
  inquiryType: 'GENERAL' | 'CAFTAN';
  inquiryProductId?: string | null;
  inquiryProductName?: string | null;
  inquiryProductNameEn?: string | null;
  messageId: string;
  createdAt: Date;
}

export interface SmtpConfig {
  host?: string | null;
  port?: string | number | null;
  user?: string | null;
  pass?: string | null;
  from?: string | null;
}

interface ResolvedSmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const normalizeString = (value: string | null | undefined) => value?.trim() || '';

const resolveSmtpConfig = (config?: SmtpConfig): ResolvedSmtpConfig => {
  const host = normalizeString(config?.host ?? process.env.SMTP_HOST);
  const user = normalizeString(config?.user ?? process.env.SMTP_USER).toLowerCase();
  const passRaw = normalizeString(config?.pass ?? process.env.SMTP_PASS);
  const from = normalizeString(config?.from ?? process.env.SMTP_FROM);
  const rawPort = config?.port ?? process.env.SMTP_PORT;
  const port = Number.parseInt(String(rawPort ?? '').trim(), 10);
  const isGoogleSmtp = host.includes('gmail.com') || user.endsWith('@gmail.com');
  const pass = isGoogleSmtp ? passRaw.replace(/\s+/g, '') : passRaw;

  return {
    host,
    port: Number.isFinite(port) ? port : 0,
    user,
    pass,
    from,
  };
};

const getFromAddress = (siteEmail: string, smtpConfig: ResolvedSmtpConfig) => {
  if (smtpConfig.from) {
    return smtpConfig.from;
  }

  if (smtpConfig.user) {
    return `"${DEFAULT_FROM_NAME}" <${smtpConfig.user}>`;
  }

  return `"${DEFAULT_FROM_NAME}" <${siteEmail}>`;
};

const transporterCache = new Map<string, nodemailer.Transporter>();

const hasInlineLogo = async () => {
  if (cachedLogoAvailable !== null) return cachedLogoAvailable;
  try {
    await access(INLINE_LOGO_PATH);
    cachedLogoAvailable = true;
  } catch {
    cachedLogoAvailable = false;
  }
  return cachedLogoAvailable;
};

const createTransporter = (config?: SmtpConfig) => {
  const smtpConfig = resolveSmtpConfig(config);

  if (!isSmtpConfigured(smtpConfig)) {
    throw new Error('SMTP is not configured');
  }

  const cacheKey = `${smtpConfig.host}:${smtpConfig.port}:${smtpConfig.user}:${smtpConfig.pass}`;
  const cachedTransporter = transporterCache.get(cacheKey);
  if (cachedTransporter) {
    return { transporter: cachedTransporter, smtpConfig };
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

  transporterCache.set(cacheKey, transporter);
  return { transporter, smtpConfig };
};

export const isSmtpConfigured = (config?: SmtpConfig | ResolvedSmtpConfig) => {
  const resolved = resolveSmtpConfig(config);
  return Boolean(
    resolved.host &&
    resolved.user &&
    resolved.pass &&
    Number.isFinite(resolved.port) &&
    resolved.port > 0
  );
};

export async function sendContactMessageEmail(payload: ContactEmailPayload, smtpConfig?: SmtpConfig) {
  const { transporter, smtpConfig: resolvedConfig } = createTransporter(smtpConfig);
  const formattedDate = payload.createdAt.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const escapedMessageId = escapeHtml(payload.messageId);
  const escapedDate = escapeHtml(formattedDate);
  const escapedName = escapeHtml(payload.visitorName);
  const escapedEmail = escapeHtml(payload.visitorEmail);
  const visitorPhone = `${payload.visitorPhoneCountryCode} ${payload.visitorPhoneNumber}`.trim();
  const escapedPhone = escapeHtml(visitorPhone);
  const escapedMessage = escapeHtml(payload.visitorMessage);
  const isCaftanInquiry = payload.inquiryType === 'CAFTAN';
  const inquiryTypeTextEn = isCaftanInquiry ? 'Specific Caftan' : 'General Inquiry';
  const inquiryTypeTextAr = isCaftanInquiry ? 'استفسار عن قفطان' : 'استفسار عام';
  const inquiryProductName = normalizeString(payload.inquiryProductName);
  const inquiryProductNameEn = normalizeString(payload.inquiryProductNameEn);
  const inquiryProductId = normalizeString(payload.inquiryProductId);
  const inquiryCaftanDisplay = [inquiryProductName, inquiryProductNameEn]
    .filter(Boolean)
    .join(' / ');
  const escapedInquiryType = escapeHtml(`${inquiryTypeTextEn} | ${inquiryTypeTextAr}`);
  const escapedInquiryCaftan = escapeHtml(inquiryCaftanDisplay || '-');
  const escapedInquiryCode = escapeHtml(inquiryProductId || '-');
  const cleanVisitorEmail = payload.visitorEmail.trim();
  const replyLink = `mailto:${cleanVisitorEmail}?subject=${encodeURIComponent('Re: your message to Luna Caftan')}`;
  const hasLogo = await hasInlineLogo();
  const logoSection = hasLogo
    ? `<img src="cid:${INLINE_LOGO_CID}" alt="Luna Caftan" style="display:block;margin:0 auto;height:68px;width:auto;max-width:240px;" />`
    : `<div style="font-size:22px;font-weight:700;letter-spacing:0.3px;">Luna Caftan</div>`;

  const subject = `Luna Contact • ${payload.visitorName}${inquiryCaftanDisplay ? ` • ${inquiryCaftanDisplay}` : ''}`;
  const text = [
    'Luna Caftan - New Contact Message',
    'رسالة جديدة من نموذج التواصل',
    '',
    `Message ID: ${payload.messageId}`,
    `Date: ${formattedDate}`,
    `Name: ${payload.visitorName}`,
    `Email: ${payload.visitorEmail}`,
    `Phone: ${visitorPhone}`,
    `Inquiry Type: ${inquiryTypeTextEn} | ${inquiryTypeTextAr}`,
    ...(isCaftanInquiry
      ? [
          `Caftan: ${inquiryCaftanDisplay || '-'}`,
          `Caftan Code: ${inquiryProductId || '-'}`,
        ]
      : []),
    '',
    'Message:',
    payload.visitorMessage,
  ].join('\n');

  const html = `
    <div style="margin:0;background:#f5f1e8;padding:24px;font-family:Arial,sans-serif;line-height:1.7;color:#1f2937;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e7ddc7;border-radius:14px;overflow:hidden;">
        <div style="padding:22px;background:linear-gradient(135deg,#2a1f16,#5b3d22);color:#f6e8c5;text-align:center;">
          ${logoSection}
          <div style="margin-top:10px;font-size:15px;opacity:0.95;">New Contact Message | رسالة تواصل جديدة</div>
        </div>

        <div style="padding:20px 22px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:14px;">
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;width:130px;">Message ID</td>
              <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${escapedMessageId}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Date</td>
              <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${escapedDate}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Name</td>
              <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${escapedName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td>
              <td style="padding:6px 0;font-size:14px;font-weight:600;">
                <a href="mailto:${escapedEmail}" style="color:#1d4ed8;text-decoration:none;">${escapedEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Phone</td>
              <td style="padding:6px 0;font-size:14px;font-weight:600;">
                <a href="tel:${escapeHtml(payload.visitorPhoneCountryCode + payload.visitorPhoneNumber)}" style="color:#111827;text-decoration:none;">${escapedPhone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;">Inquiry</td>
              <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${escapedInquiryType}</td>
            </tr>
            ${isCaftanInquiry ? `
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Caftan</td>
                <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${escapedInquiryCaftan}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:13px;">Code</td>
                <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${escapedInquiryCode}</td>
              </tr>
            ` : ''}
          </table>

          <div style="margin-top:10px;margin-bottom:8px;font-size:13px;color:#6b7280;">Message | الرسالة</div>
          <div style="padding:14px;border:1px solid #e5e7eb;border-radius:10px;background:#fafaf9;white-space:pre-wrap;color:#111827;">${escapedMessage}</div>

          <div style="margin-top:18px;">
            <a href="${replyLink}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#b68a4c;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;">Reply to Visitor</a>
          </div>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: getFromAddress(payload.siteEmail, resolvedConfig),
    to: payload.toEmail,
    replyTo: payload.visitorEmail,
    subject,
    text,
    html,
    attachments: hasLogo
      ? [
          {
            filename: 'logo-white.png',
            path: INLINE_LOGO_PATH,
            cid: INLINE_LOGO_CID,
          },
        ]
      : undefined,
  });
}
