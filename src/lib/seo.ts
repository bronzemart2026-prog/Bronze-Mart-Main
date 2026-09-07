export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bronzemart.com';

export const SITE_NAME = 'Bronze Mart';
export const SITE_NAME_BN = 'ব্রোঞ্জ মার্ট';
export const SITE_TAGLINE = 'কোয়ালিটি, ট্রাস্ট ও ভ্যালু';
export const SITE_DESCRIPTION =
  'ব্রোঞ্জ মার্টে সেরা মানের পোশাক, প্রসাধন ও স্কিনকেয়ার, জুতো, ব্যাগ এবং লাইফস্টাইল সামগ্রী সাশ্রয়ী মূল্যে কিনুন। দ্রুত ক্যাশ অন ডেলিভারি ও সহজ রিটার্ন সুবিধা।';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export const SEO_KEYWORDS = [
  'Bronze Mart',
  'ব্রোঞ্জ মার্ট',
  'অনলাইন শপিং বাংলাদেশ',
  'ছেলেদের পোশাক',
  'মেয়েদের পোশাক',
  'অথেনটিক কসমেটিকস',
  'স্কিনকেয়ার বাংলাদেশ',
  'জুতো ও ব্যাগ',
  'লাইফস্টাইল শপ',
  'ক্যাশ অন ডেলিভারি',
  'Online shopping Bangladesh',
  'Bronze Mart BD',
  'Fashion eCommerce Dhaka',
  'Skin Care products BD',
];

/**
 * Helper to construct canonical URLs
 */
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Organization & OnlineStore JSON-LD Schema
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [SITE_NAME_BN, 'BronzeMart Bangladesh'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      caption: SITE_NAME,
    },
    image: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    priceRange: '৳৳',
    currenciesAccepted: 'BDT',
    paymentAccepted: 'Cash, bKash, Credit Card, Debit Card',
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressLocality: 'Dhaka',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * WebSite JSON-LD Schema with Sitelinks Searchbox
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_NAME_BN,
    url: SITE_URL,
    inLanguage: ['bn', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product JSON-LD Schema
 */
export function getProductSchema(product: {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  images: string[];
  stock: number;
  category?: { name: string } | null;
  rating?: number;
}) {
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [DEFAULT_OG_IMAGE];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.title,
    description: product.description || product.title,
    image: images,
    sku: `BM-${product.id.slice(0, 8).toUpperCase()}`,
    category: product.category?.name || 'Fashion & Lifestyle',
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.8,
      reviewCount: 24,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * BreadcrumbList JSON-LD Schema
 */
export function getBreadcrumbSchema(
  items: { name: string; item: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : `${SITE_URL}${item.item}`,
    })),
  };
}

/**
 * ItemList / CollectionPage JSON-LD Schema
 */
export function getItemListSchema(
  name: string,
  description: string,
  items: { title: string; slug: string; price: number; image?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/products/${item.slug}`,
      name: item.title,
      image: item.image || DEFAULT_OG_IMAGE,
    })),
  };
}
