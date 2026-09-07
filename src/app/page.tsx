import React from 'react';
import type { Metadata } from 'next';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import StoreFeatures from '@/components/home/StoreFeatures';
import JsonLd from '@/components/common/JsonLd';
import { getCategories, getProducts } from '@/lib/api';
import { SITE_NAME, SITE_NAME_BN, SITE_DESCRIPTION, getItemListSchema } from '@/lib/seo';

export const revalidate = 60; // ISR cache revalidation every 60s

export const metadata: Metadata = {
  title: `${SITE_NAME} | সেরা মানের ফ্যাশন, স্কিনকেয়ার ও লাইফস্টাইল পণ্য`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} - ${SITE_NAME_BN} | অনলাইন শপিং`,
    description: SITE_DESCRIPTION,
    url: '/',
    type: 'website',
  },
};

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
  ]);

  const featuredItemListSchema =
    products.length > 0
      ? getItemListSchema(
          'ফিচার্ড পণ্য কালেকশন - ব্রোঞ্জ মার্ট',
          'আমাদের জনপ্রিয় ও ট্রেন্ডিং পোশাক এবং স্কিনকেয়ার পণ্যের তালিকা',
          products.map((p) => ({
            title: p.title,
            slug: p.slug,
            price: p.price,
            image: p.images?.[0],
          }))
        )
      : null;

  return (
    <div className="flex flex-col min-h-screen">
      {featuredItemListSchema && <JsonLd data={featuredItemListSchema} />}
      <HeroBanner />
      <CategorySection categories={categories} />
      <FeaturedProducts products={products} />
      <StoreFeatures />
    </div>
  );
}

