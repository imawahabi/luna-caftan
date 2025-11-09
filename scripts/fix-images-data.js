const { PrismaClient } = require('@prisma/client');
require('dotenv/config');

const prisma = new PrismaClient();

async function fixImagesData() {
  try {
    console.log('🔍 Checking products with broken images...');
    
    const products = await prisma.product.findMany();
    console.log(`📦 Found ${products.length} products total.`);

    let fixedCount = 0;
    let alreadyGoodCount = 0;

    for (const product of products) {
      let images = product.images;
      
      // Log current state
      console.log(`\n📝 Product: ${product.name}`);
      console.log(`   Current images value: ${images}`);
      console.log(`   Type: ${typeof images}`);

      // Try to parse if it's a string
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].startsWith('http')) {
            console.log(`   ✅ Already good: ${parsed.length} images`);
            alreadyGoodCount++;
            continue;
          } else {
            console.log(`   ⚠️ Parsed but invalid: ${JSON.stringify(parsed)}`);
          }
        } catch (error) {
          console.log(`   ⚠️ Failed to parse: ${error.message}`);
        }
      }

      // If we got here, the data needs fixing
      console.log(`   ❌ Needs fixing - setting to empty array`);
      
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: JSON.stringify([])
        }
      });
      
      fixedCount++;
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Already good: ${alreadyGoodCount}`);
    console.log(`   🔧 Fixed: ${fixedCount}`);
    console.log('\n⚠️ Products with empty images need to be re-uploaded from admin panel.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImagesData();
