import { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/lib/api';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600; // Revalidate sitemap at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts({ limit: 500 }),
    ]);

    // 2. Category routes
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${SITE_URL}/products?category=${encodeURIComponent(cat.slug)}`,
      lastModified: cat.created_at || currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 3. Product detail routes
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${SITE_URL}/products/${encodeURIComponent(product.slug)}`,
      lastModified: product.created_at || currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticRoutes;
  }
}
