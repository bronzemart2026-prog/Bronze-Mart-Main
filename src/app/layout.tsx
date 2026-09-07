import type { Metadata, Viewport } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import './globals.css';
import StoreLayoutShell from '@/components/layout/StoreLayoutShell';
import JsonLd from '@/components/common/JsonLd';
import {
  SITE_URL,
  SITE_NAME,
  SITE_NAME_BN,
  SITE_DESCRIPTION,
  SEO_KEYWORDS,
  getOrganizationSchema,
  getWebSiteSchema,
  getFaqSchema,
} from '@/lib/seo';

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#8d4c2d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | সেরা মানের ফ্যাশন, স্কিনকেয়ার ও লাইফস্টাইল পণ্য`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/logo-mark.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo-mark.png',
    apple: [{ url: '/logo-mark.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: `${SITE_NAME} - ${SITE_NAME_BN}`,
    title: `${SITE_NAME} | সেরা মানের ফ্যাশন, স্কিনকেয়ার ও লাইফস্টাইল পণ্য`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ${SITE_NAME_BN}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | অনলাইন শপিং বাংলাদেশ`,
    description: SITE_DESCRIPTION,
    images: ['/logo.png'],
    creator: '@BronzeMart',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'ecommerce',
  other: {
    'fb:app_id': '61589057942669',
    'rating': 'general',
    'geo.region': 'BD-13',
    'geo.placename': 'Banshkhali, Chattogram, Bangladesh',
    'geo.position': '22.0333;91.9500',
    'ICBM': '22.0333, 91.9500',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();
  const faqSchema = getFaqSchema();

  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={`h-full antialiased scroll-smooth ${hindSiliguri.variable} ${hindSiliguri.className}`}
    >
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />
        <JsonLd data={faqSchema} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        <StoreLayoutShell>{children}</StoreLayoutShell>
      </body>
    </html>
  );
}

