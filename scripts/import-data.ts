const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

// Connect to Neon PostgreSQL database (from .env)
const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('📥 Importing data to Neon database...');

    // Read exported data
    const exportPath = path.join(__dirname, 'exported-data.json');
    
    if (!fs.existsSync(exportPath)) {
      console.error('❌ No exported data found. Run export-data.ts first!');
      return;
    }

    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));

    console.log(`📊 Found ${data.admins.length} admins, ${data.products.length} products, ${data.settings.length} settings`);

    // Import Admins
    console.log('\n👤 Importing admins...');
    for (const admin of data.admins) {
      const adminData = {
        ...admin,
        createdAt: new Date(admin.createdAt),
        updatedAt: new Date(admin.updatedAt)
      };
      await prisma.admin.upsert({
        where: { id: admin.id },
        update: adminData,
        create: adminData
      });
    }
    console.log(`✅ Imported ${data.admins.length} admins`);

    // Import Products
    console.log('\n🛍️ Importing products...');
    for (const product of data.products) {
      const productData = {
        ...product,
        featured: Boolean(product.featured),
        active: Boolean(product.active),
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      };
      await prisma.product.upsert({
        where: { id: product.id },
        update: productData,
        create: productData
      });
    }
    console.log(`✅ Imported ${data.products.length} products`);

    // Import Settings
    console.log('\n⚙️ Importing settings...');
    for (const setting of data.settings) {
      const settingData = {
        ...setting,
        createdAt: new Date(setting.createdAt),
        updatedAt: new Date(setting.updatedAt)
      };
      await prisma.settings.upsert({
        where: { id: setting.id },
        update: settingData,
        create: settingData
      });
    }
    console.log(`✅ Imported ${data.settings.length} settings`);

    console.log('\n🎉 All data imported successfully to Neon!');

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
