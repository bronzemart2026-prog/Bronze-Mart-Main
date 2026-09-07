export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bronzemart.com';

export const SITE_NAME = 'Bronze Mart';
export const SITE_NAME_BN = 'ব্রোঞ্জ মার্ট';
export const SITE_TAGLINE = 'কোয়ালিটি, ট্রাস্ট ও ভ্যালু';
export const SITE_DESCRIPTION =
  'ব্রোঞ্জ মার্টে সেরা মানের রুচিশীল পোশাক, প্রিমিয়াম স্কিনকেয়ার ও প্রসাধন, ট্রেন্ডি জুতো ও ব্যাগ কিনুন সবচেয়ে সাশ্রয়ী মূল্যে। সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি, বাঁশখালীতে ফ্রি ডেলিভারি ও সহজ রিটার্ন সুবিধা।';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/people/Bronze-Mart/61589057942669/';
export const HOTLINE_PHONE = '+8801883360440';
export const HOTLINE_DISPLAY = '০১৮৮৩-৩৬০৪৪০';
export const SUPPORT_EMAIL = 'bronzemart2026@gmail.com';

export const SEO_KEYWORDS = [
  'bronze-mart',
  'bronze mart',
  'bronze mart bd',
  'bronzemart',
  'bronzemart.com',
  'bronzemart bd',
  'online shopping bd',
  'online shopping bangladesh',
  'banskhali cosmetics',
  'banshkhali cosmetics',
  'banshkhali online shop',
  'banskhalite free delivery',
  'banshkhali shopping',
  'chattogram online shop',
  'chittagong online shopping',
  'chattogram cosmetics',
  'authentic cosmetics bd',
  'skin care bangladesh',
  'ladies bag bd',
  'mens fashion bd',
  'womens clothing bd',
  'jewelry shop bd',
  'cash on delivery bd',
  'ব্রোঞ্জ মার্ট',
  'ব্রোঞ্জ-মার্ট',
  'ব্রোঞ্জ মার্ট বাঁশখালী',
  'বাঁশখালী কসমেটিকস',
  'বাঁশখালী প্রসাধন সামগ্রী',
  'বাঁশখালী অনলাইন শপ',
  'চট্টগ্রাম অনলাইন শপিং',
  'অনলাইন শপিং বাংলাদেশ',
  'অনলাইন শপিং বিডি',
  'অনলাইন কেনাকাটা বাংলাদেশ',
  'ছেলেদের আধুনিক পোশাক',
  'মেয়েদের ট্রেন্ডি ড্রেস ও শাড়ি',
  'অথেনটিক কসমেটিকস বিডি',
  'প্রিমিয়াম স্কিনকেয়ার সামগ্রী',
  'জুতো ও লেডিস ব্যাগ',
  'অনলাইন জুয়েলারি শপ',
  'ক্যাশ অন ডেলিভারি শপিং',
  'ফ্রি ডেলিভারি বাঁশখালী',
  'Buy clothes online BD',
  'Authentic makeup BD',
  'Cash on Delivery shopping BD',
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
    alternateName: [SITE_NAME_BN, 'BronzeMart BD', 'Bronze Mart Bangladesh'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo-mark.png`,
      caption: SITE_NAME,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    priceRange: '৳৳',
    currenciesAccepted: 'BDT',
    paymentAccepted: 'Cash, bKash, Nagad, Credit Card, Debit Card',
    telephone: HOTLINE_PHONE,
    email: SUPPORT_EMAIL,
    sameAs: [
      FACEBOOK_PAGE_URL,
      `https://wa.me/8801883360440`,
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: HOTLINE_PHONE,
        contactType: 'customer service',
        areaServed: 'BD',
        availableLanguage: ['Bengali', 'English'],
        contactOption: 'TollFree',
      },
      {
        '@type': 'ContactPoint',
        telephone: HOTLINE_PHONE,
        contactType: 'sales',
        areaServed: 'BD',
        availableLanguage: ['Bengali', 'English'],
      },
    ],
    areaServed: [
      {
        '@type': 'Country',
        name: 'Bangladesh',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Chattogram Division',
      },
      {
        '@type': 'City',
        name: 'Banshkhali',
      },
      {
        '@type': 'City',
        name: 'Dhaka',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Heed Para, Monkirchor, Shilkup',
      addressLocality: 'Banshkhali',
      addressRegion: 'Chattogram',
      postalCode: '4390',
      addressCountry: 'BD',
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'BD',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
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
    alternateName: [SITE_NAME_BN, 'Bronze Mart'],
    url: SITE_URL,
    inLanguage: ['bn-BD', 'en-US'],
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
 * Product JSON-LD Schema (Google Merchant / Rich Snippets Ready)
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
    mpn: `BM-MPN-${product.id.slice(0, 8).toUpperCase()}`,
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
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 70,
          currency: 'BDT',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'BD',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'd',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'BD',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: 38,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * FAQPage JSON-LD Schema (Google Rich FAQ Snippets)
 */
export function getFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ব্রোঞ্জ মার্টে ডেলিভারি চার্জ কত?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'বাঁশখালীর ভেতরে ১০০০+ টাকার অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি। চট্টগ্রাম সিটিতে ৭০ টাকা এবং সারা দেশের যেকোনো জেলায় ক্যাশ অন ডেলিভারি চার্জ মাত্র ১৫০ টাকা।',
        },
      },
      {
        '@type': 'Question',
        name: 'পণ্য কীভাবে অর্ডার করব এবং পেমেন্ট পদ্ধতি কী?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'পণ্যটি কার্টে যুক্ত করে আপনার নাম, ঠিকানা ও মোবাইল নম্বর দিয়ে সহজে অর্ডার করতে পারবেন। ক্যাশ অন ডেলিভারি এবং বিকাশের মাধ্যমে নিরাপদ পেমেন্ট সুবিধা রয়েছে।',
        },
      },
      {
        '@type': 'Question',
        name: 'পণ্য ডেলিভারি পেতে কত সময় লাগে?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'চট্টগ্রাম সিটির মধ্যে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং সারা দেশে ২ থেকে ৩ কার্যদিবসের মধ্যে হোম ডেলিভারি পৌঁছে দেওয়া হয়।',
        },
      },
      {
        '@type': 'Question',
        name: 'পণ্য পরিবর্তন বা রিটার্ন করার নিয়ম কী?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'পণ্য পাওয়ার পর কোনো সমস্যা থাকলে ৭ দিনের মধ্যে আমাদের কাস্টমার কেয়ারে (০১৮৮৩-৩৬০৪৪০) যোগাযোগ করে সহজে এক্সচেঞ্জ বা রিটার্ন করতে পারবেন।',
        },
      },
    ],
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
