import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const defaultSettingsEntries = [
  ['site_title_ar', 'Luna Caftan | قفاطين مغربية فاخرة'],
  ['site_title_en', 'Luna Caftan | Luxury Moroccan Caftans'],
  ['site_description_ar', 'قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت'],
  ['site_description_en', 'Luxurious handcrafted Moroccan caftans from Fes to Kuwait'],
  ['whatsapp_number', '+965 69059697'],
  ['email', 'contact@lunacaftan.com'],
  ['instagram_url', 'https://instagram.com/luna.caftan.kw'],
  ['phone', ''],
  ['facebook_url', ''],
  ['twitter_url', ''],
  ['logo_url', '/logo-white.png'],
  ['banner_url', ''],
  ['about_ar', ''],
  ['about_en', ''],
  ['address_ar', ''],
  ['address_en', ''],
];

const defaultSettings = defaultSettingsEntries.reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {} as Record<string, string>);

// GET all settings
export async function GET() {
  try {
    const settings = await prisma.settings.findMany();

    const settingsObj: Record<string, string> = {};
    for (const setting of settings) {
      settingsObj[setting.key] = setting.value;
    }

    // Merge with defaults to ensure missing keys have fallback values
    return NextResponse.json({ ...defaultSettings, ...settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Fall back to default settings instead of throwing
    return NextResponse.json(defaultSettings, { status: 200 });
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
        // @ts-ignore - Prisma client type issue
        await prisma.settings.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        });
        console.log(`✅ Updated setting: ${key}`);
      } catch (err: any) {
        console.error(`❌ Failed to update setting: ${key}`, err);
        console.error('Full error:', err);
        throw new Error(`Failed to update ${key}: ${err.message}`);
      }
    }

    return NextResponse.json({ message: 'تم تحديث الإعدادات بنجاح' });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error.message || 'فشل تحديث الإعدادات' },
      { status: 500 }
    );
  }
}
