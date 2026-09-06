import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import StoreFeatures from '@/components/home/StoreFeatures';
import { getCategories, getProducts } from '@/lib/api';

export const revalidate = 60; // ISR cache revalidation every 60s

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 5 }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <CategorySection categories={categories} />
      <FeaturedProducts products={products} />
      <StoreFeatures />
    </div>
  );
}
