import { MetadataRoute } from 'next';
import { SITE_NAME, SITE_NAME_BN, SITE_DESCRIPTION } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - ${SITE_NAME_BN}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8d4c2d',
    icons: [
      {
        src: '/logo-mark.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-mark.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
