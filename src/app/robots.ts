import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/products/*', '/about'],
        disallow: [
          '/admin',
          '/admin/*',
          '/account',
          '/account/*',
          '/checkout',
          '/checkout/*',
          '/auth',
          '/auth/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
