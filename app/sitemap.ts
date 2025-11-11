import { MetadataRoute } from 'next';

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

  // Fetch products for dynamic pages
  let productPages: MetadataRoute.Sitemap = [];
  
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (res.ok) {
      const products = await res.json();
      
      productPages = products.map((product: any) => {
        const slug = product.nameEn
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        return {
          url: `${baseUrl}/caftans/${slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: product.featured ? 0.9 : 0.8,
        };
      });
    }
  } catch (error) {
    console.error('Error generating product sitemap:', error);
  }

  return [...staticPages, ...productPages];
}
