const { PrismaClient } = require('@prisma/client');
const { v2: cloudinary } = require('cloudinary');
const path = require('path');
const fs = require('fs');
require('dotenv/config');

const prisma = new PrismaClient();

async function migrateImages() {
  try {
    if (!process.env.CLOUDINARY_URL) {
      console.error('❌ CLOUDINARY_URL is not defined in the environment.');
      process.exit(1);
    }

    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
    });

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.warn('⚠️ No local uploads directory found. Skipping file uploads.');
    }

    console.log('📦 Fetching products from database...');
    const products = await prisma.product.findMany();
    console.log(`✅ Found ${products.length} products.`);

    let uploadedCount = 0;
    let skippedCount = 0;
    let updatedProducts = 0;

    for (const product of products) {
      let images;
      try {
        images = JSON.parse(product.images || '[]');
      } catch (error) {
        console.error(`❌ Failed to parse images for product ${product.id}. Skipping.`);
        continue;
      }

      if (!Array.isArray(images) || images.length === 0) {
        skippedCount += 1;
        continue;
      }

      let hasChanges = false;
      const updatedImages = [];

      for (const imageUrl of images) {
        if (!imageUrl || typeof imageUrl !== 'string') {
          updatedImages.push(imageUrl);
          continue;
        }

        if (!imageUrl.startsWith('/uploads/')) {
          updatedImages.push(imageUrl);
          continue;
        }

        const filename = imageUrl.replace('/uploads/', '');
        const filePath = path.join(uploadsDir, filename);

        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️ File not found for image ${imageUrl} (product ${product.id}). Skipping.`);
          updatedImages.push(imageUrl);
          continue;
        }

        try {
          console.log(`⬆️ Uploading ${filename} for product ${product.id}...`);
          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'luna-caftan/products',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            resource_type: 'image',
            transformation: [
              { width: 1600, height: 2000, crop: 'limit', quality: 'auto:good' }
            ],
          });

          updatedImages.push(result.secure_url);
          uploadedCount += 1;
          hasChanges = true;
        } catch (error) {
          console.error(`❌ Failed to upload ${filename}:`, error.message);
          updatedImages.push(imageUrl);
        }
      }

      if (hasChanges) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: JSON.stringify(updatedImages),
          },
        });
        updatedProducts += 1;
        console.log(`✅ Updated product ${product.id} image URLs.`);
      } else {
        skippedCount += 1;
      }
    }

    console.log('\n🎉 Migration complete!');
    console.log(`➡️ Images uploaded: ${uploadedCount}`);
    console.log(`➡️ Products updated: ${updatedProducts}`);
    console.log(`➡️ Products skipped (no changes): ${skippedCount}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateImages();
