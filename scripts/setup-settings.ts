const { PrismaClient } = require('@prisma/client');
require('dotenv/config');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Setting up default site settings...');

  const defaultSettings = [
    {
      key: 'site_title_ar',
      value: 'Luna Caftan | قفاطين مغربية فاخرة',
      description: 'عنوان الموقع بالعربية',
    },
    {
      key: 'site_title_en',
      value: 'Luna Caftan | Luxury Moroccan Caftans',
      description: 'Site title in English',
    },
    {
      key: 'site_description_ar',
      value: 'قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت',
      description: 'وصف الموقع بالعربية',
    },
    {
      key: 'site_description_en',
      value: 'Luxurious handcrafted Moroccan caftans from Fes to Kuwait',
      description: 'Site description in English',
    },
    {
      key: 'favicon_url',
      value: '/logo.png',
      description: 'رابط أيقونة الموقع (Favicon)',
    },
    {
      key: 'logo_url',
      value: '/logo-white.png',
      description: 'رابط شعار الموقع',
    },
    {
      key: 'whatsapp_number',
      value: '+965 69059697',
      description: 'رقم الواتساب',
    },
    {
      key: 'instagram_url',
      value: 'https://instagram.com/luna.caftan.kw',
      description: 'رابط حساب Instagram',
    },
    {
      key: 'email',
      value: 'contact@lunacaftan.com',
      description: 'البريد الإلكتروني',
    },
  ];

  for (const setting of defaultSettings) {
    try {
      const existing = await prisma.settings.findUnique({
        where: { key: setting.key },
      });

      if (existing) {
        console.log(`⏭️  Setting already exists: ${setting.key}`);
      } else {
        await prisma.settings.create({ data: setting });
        console.log(`✅ Created setting: ${setting.key}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create setting: ${setting.key}`, error);
    }
  }

  console.log('✅ Settings setup completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
