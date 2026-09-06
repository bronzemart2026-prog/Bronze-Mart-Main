import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { ArrowUpRight, Shirt, Heart, Package, ShoppingBag, Watch, Home } from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
}

function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'womens-clothing':
    case 'mens-clothing':
      return <Shirt className="w-5 h-5" />;
    case 'cosmetics-skincare':
      return <Heart className="w-5 h-5" />;
    case 'footwear-bags':
      return <ShoppingBag className="w-5 h-5" />;
    case 'jewelry-accessories':
      return <Watch className="w-5 h-5" />;
    case 'home-lifestyle':
      return <Home className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
}

export default function CategorySection({ categories }: CategorySectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            ক্যাটাগরি সমূহ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            ক্যাটাগরি অনুযায়ী কেনাকাটা করুন
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4c2d] hover:text-[#743e2a] transition-colors"
        >
          <span>সব পণ্য দেখুন</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative rounded-2xl bg-white border border-stone-200 p-6 shadow-xs hover:shadow-md hover:border-[#8d4c2d] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 group-hover:bg-[#8d4c2d] group-hover:text-white flex items-center justify-center transition-colors">
                {getCategoryIcon(cat.slug)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#8d4c2d] transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#8d4c2d]">
              <span>কালেকশন দেখুন</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
