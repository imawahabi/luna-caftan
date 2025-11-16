import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { generateProductSlug } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lunacaftan.com'; // Replace with your actual domain

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Fetch products for dynamic pages directly from the database
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        name: true,
        nameEn: true,
        updatedAt: true,
        featured: true,
      },
    });

    productPages = products.map((product) => {
      const slugSource = product.nameEn || product.name;
      const slug = generateProductSlug(slugSource);

      return {
        url: `${baseUrl}/caftans/${slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: product.featured ? 0.9 : 0.8,
      };
    });
  } catch (error) {
    console.error('Error generating product sitemap:', error);
  }

  return [...staticPages, ...productPages];
}
