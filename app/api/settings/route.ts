import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const defaultSettingsEntries = [
  ['site_title_ar', 'Luna Caftan | قفاطين مغربية فاخرة'],
  ['site_title_en', 'Luna Caftan | Luxury Moroccan Caftans'],
  ['site_description_ar', 'قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت'],
  ['site_description_en', 'Luxurious handcrafted Moroccan caftans from Fes to Kuwait'],
  ['whatsapp_number', '+965 51246133'],
  ['email', 'contact@lunacaftan.com'],
  ['instagram_url', 'https://instagram.com/luna.caftan.kw'],
  ['phone', ''],
  ['facebook_url', ''],
  ['twitter_url', ''],
  ['logo_url', '/logo-white.png'],
  ['banner_url', ''],
  ['hero_background_url', '/images/hero.jpg'],
  ['about_background_url', '/images/hero.jpg'],
  ['about_hero_background_url', '/images/about.jpg'],
  ['collection_hero_background_url', '/images/hero.jpg'],
  ['contact_hero_background_url', '/images/about.jpg'],
  ['wishlist_hero_background_url', '/images/hero.jpg'],
  ['about_ar', ''],
  ['about_en', ''],
  ['address_ar', ''],
  ['address_en', ''],
  ['smtp_host', ''],
  ['smtp_port', '587'],
  ['smtp_user', ''],
  ['smtp_pass', ''],
  ['smtp_from', ''],
];

const defaultSettings = defaultSettingsEntries.reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {} as Record<string, string>);

const sensitiveSettingKeys = new Set([
  'smtp_host',
  'smtp_port',
  'smtp_user',
  'smtp_pass',
  'smtp_from',
]);

const sanitizePublicSettings = (settings: Record<string, string>) => {
  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(settings)) {
    if (!sensitiveSettingKeys.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'فشل تحديث الإعدادات';
};

// GET all settings
export async function GET() {
  let isAdminRequest = false;

  try {
    const session = await getServerSession(authOptions);
    isAdminRequest = Boolean(session);
    const settings = await prisma.settings.findMany();

    const settingsObj: Record<string, string> = {};
    for (const setting of settings) {
      settingsObj[setting.key] = setting.value;
    }

    // Merge with defaults to ensure missing keys have fallback values
    const mergedSettings = { ...defaultSettings, ...settingsObj };
    return NextResponse.json(
      isAdminRequest ? mergedSettings : sanitizePublicSettings(mergedSettings)
    );
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Fall back to default settings instead of throwing
    return NextResponse.json(
      isAdminRequest ? defaultSettings : sanitizePublicSettings(defaultSettings),
      { status: 200 }
    );
  }
}

// PUT update settings (Admin only)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updates = Object.entries(body);

    console.log('Updating settings:', updates.length, 'items');

    // Update each setting
    for (const [key, value] of updates) {
      try {
        await prisma.settings.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        });
        console.log(`✅ Updated setting: ${key}`);
      } catch (err: unknown) {
        console.error(`❌ Failed to update setting: ${key}`, err);
        console.error('Full error:', err);
        throw new Error(`Failed to update ${key}: ${getErrorMessage(err)}`);
      }
    }

    return NextResponse.json({ message: 'تم تحديث الإعدادات بنجاح' });
  } catch (error: unknown) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
