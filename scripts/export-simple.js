const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const exportPath = path.join(__dirname, 'exported-data.json');

console.log('📦 Exporting data from SQLite database...');
console.log('📁 Database:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    process.exit(1);
  }
});

const data = {
  admins: [],
  products: [],
  settings: [],
  exportedAt: new Date().toISOString()
};

// Export Admins
db.all('SELECT * FROM Admin', (err, rows) => {
  if (err) {
    console.error('❌ Error reading admins:', err);
  } else {
    data.admins = rows || [];
    console.log(`✅ Found ${data.admins.length} admins`);
  }

  // Export Products
  db.all('SELECT * FROM Product', (err, rows) => {
    if (err) {
      console.error('❌ Error reading products:', err);
    } else {
      data.products = rows || [];
      console.log(`✅ Found ${data.products.length} products`);
    }

    // Export Settings
    db.all('SELECT * FROM Settings', (err, rows) => {
      if (err) {
        console.error('❌ Error reading settings:', err);
      } else {
        data.settings = rows || [];
        console.log(`✅ Found ${data.settings.length} settings`);
      }

      // Save to file
      fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
      console.log('\n🎉 Data exported successfully!');
      console.log(`📁 File: ${exportPath}`);

      db.close();
    });
  });
});
