const { PrismaClient } = require('@prisma/client');
require('dotenv/config');

// المنتجات الحالية
const products = [
  {
    id: 1,
    name: 'قفطان الأمير',
    nameEn: 'Royal Caftan',
    description: 'قفطان فاخر مطرز يدوياً بخيوط ذهبية على قماش حريري فاخر',
    descriptionEn: 'Luxurious hand-embroidered caftan with golden threads on premium silk fabric',
    price: '250 د.ك',
    priceEn: '250 KD',
    details: ['حرير طبيعي 100%', 'تطريز يدوي بخيوط ذهبية', 'تصميم مغربي أصيل', 'قياسات قابلة للتخصيص'],
    detailsEn: ['100% Natural Silk', 'Hand-embroidered with golden threads', 'Authentic Moroccan design', 'Customizable measurements'],
    images: ['/images/caftan-1.jpg', '/images/caftan-1-2.jpg']
  },
  // ... يمكن إضافة باقي المنتجات هنا إذا أردت
];

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migrating products to database...');

  for (const product of products) {
    try {
      await prisma.product.create({
        data: {
          name: product.name,
          nameEn: product.nameEn,
          description: product.description,
          descriptionEn: product.descriptionEn,
          price: product.price,
          priceEn: product.priceEn,
          details: JSON.stringify(product.details),
          detailsEn: JSON.stringify(product.detailsEn),
          images: JSON.stringify(product.images),
          featured: false,
          active: true,
        },
      });

      console.log(`✅ Migrated: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to migrate: ${product.name}`, error);
    }
  }

  console.log('✅ Migration completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
