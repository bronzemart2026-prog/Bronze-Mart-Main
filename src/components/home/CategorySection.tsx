import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { ArrowUpRight, Shirt, Heart, ShoppingBag, Watch, Home, Tag } from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
}

function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'womens-clothing':
      return <Shirt className="w-4 h-4" />;
    case 'mens-clothing':
      return <Shirt className="w-4 h-4" />;
    case 'cosmetics-skincare':
      return <Heart className="w-4 h-4" />;
    case 'footwear-bags':
      return <ShoppingBag className="w-4 h-4" />;
    case 'jewelry-accessories':
      return <Watch className="w-4 h-4" />;
    case 'home-lifestyle':
      return <Home className="w-4 h-4" />;
    default:
      return <Tag className="w-4 h-4" />;
  }
}

export default function CategorySection({ categories }: CategorySectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-5 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-[#8d4c2d]" />
          <h2 className="text-sm sm:text-base font-bold text-stone-900">
            ক্যাটাগরি সমূহ
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8d4c2d] hover:text-[#743e2a] transition-colors"
        >
          <span>সকল পণ্য</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category Pills / Cards - Full Text Visibility */}
      <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-2.5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200/90 hover:border-[#8d4c2d] hover:bg-[#8d4c2d]/5 shadow-2xs hover:shadow-xs transition-all duration-200"
          >
            {/* Real Ecommerce Icon */}
            <div className="w-6 h-6 rounded-md bg-stone-100 text-[#8d4c2d] group-hover:bg-[#8d4c2d] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
              {getCategoryIcon(cat.slug)}
            </div>

            {/* Complete Full Category Name */}
            <span className="text-xs sm:text-[13px] font-bold text-stone-800 group-hover:text-[#8d4c2d] transition-colors whitespace-nowrap">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}



