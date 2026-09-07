'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '../products/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'all'>('featured');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'featured') return p.is_featured;
    if (activeTab === 'trending') return p.is_trending;
    return true;
  });

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-stone-50 border-y border-stone-200">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              জনপ্রিয় পছন্দসমূহ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              নির্বাচিত পণ্য কালেকশন
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'featured'
                  ? 'bg-[#8d4c2d] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              সেরা নির্বাচিত
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'trending'
                  ? 'bg-[#8d4c2d] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ট্রেন্ডিং
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-[#8d4c2d] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              সকল পণ্য
            </button>
          </div>
        </div>

        {/* Products Grid (5 Products Layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Explore Button */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-stone-200 hover:border-[#8d4c2d] text-[#8d4c2d] text-xs font-bold rounded-xl hover:bg-[#8d4c2d] hover:text-white transition-all shadow-xs"
          >
            <span>স্টোরের সব পণ্য দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
