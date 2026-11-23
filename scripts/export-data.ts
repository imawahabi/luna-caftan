const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Override DATABASE_URL to use local SQLite
process.env.DATABASE_URL = 'file:./dev.db';

// Connect to LOCAL SQLite database
const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('📦 Exporting data from local database...');

    // Export all data
    const admins = await prisma.admin.findMany();
    const products = await prisma.product.findMany();
    const settings = await prisma.settings.findMany();

    const data = {
      admins,
      products,
      settings,
      exportedAt: new Date().toISOString()
    };

    // Save to JSON file
    const exportPath = path.join(__dirname, 'exported-data.json');
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));

    console.log('✅ Data exported successfully!');
    console.log(`📊 Admins: ${admins.length}`);
    console.log(`📊 Products: ${products.length}`);
    console.log(`📊 Settings: ${settings.length}`);
    console.log(`📁 File: ${exportPath}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
