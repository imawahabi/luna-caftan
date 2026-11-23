const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixViews() {
  try {
    console.log('🔧 Fixing views and likes for all products...');
    
    // Get all products
    const products = await prisma.product.findMany();
    console.log(`📊 Found ${products.length} products`);
    
    // Update each product to ensure views and likes have values
    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          views: product.views || 0,
          likes: product.likes || 0,
        },
      });
      console.log(`✅ Updated product: ${product.name} (views: ${product.views || 0}, likes: ${product.likes || 0})`);
    }
    
    console.log('🎉 All products updated successfully!');
  } catch (error) {
    console.error('❌ Error fixing views:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixViews();
