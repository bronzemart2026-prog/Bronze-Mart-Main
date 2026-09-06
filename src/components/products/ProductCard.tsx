'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const discountPercent = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) * 100
      )
    : null;

  const defaultImg =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white border border-stone-200/90 hover:border-[#8d4c2d]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Compact Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={defaultImg}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            unoptimized
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent && discountPercent > 0 ? (
            <span className="rounded-md bg-[#8d4c2d] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
              -{discountPercent}%
            </span>
          ) : null}
          {product.is_trending && (
            <span className="rounded-md bg-stone-900/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
              ট্রেন্ডিং
            </span>
          )}
        </div>

        {/* Quick View Button on Image Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
          <Link
            href={`/products/${product.slug}`}
            className="p-2 bg-white/95 text-stone-800 rounded-full hover:bg-white hover:scale-110 transition-all shadow-md pointer-events-auto"
            title="বিস্তারিত দেখুন"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="p-2 bg-[#8d4c2d] text-white rounded-full hover:bg-[#743e2a] hover:scale-110 transition-all shadow-md pointer-events-auto"
            title="কার্টে যোগ করুন"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Compact Content */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400 mb-1">
          <span className="truncate font-medium max-w-[90px] sm:max-w-[110px]">
            {product.category?.name || 'ফ্যাশন'}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold flex-shrink-0">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
          </div>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className="group-hover:text-[#8d4c2d] transition-colors mb-1.5 block"
        >
          <h3 className="font-semibold text-stone-900 text-xs sm:text-[13px] line-clamp-2 leading-snug min-h-[32px] sm:min-h-[36px]">
            {product.title}
          </h3>
        </Link>

        {/* Price & Action Row */}
        <div className="mt-auto pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-stone-900">
                ৳{product.price.toFixed(0)}
              </span>
              {product.compare_at_price && (
                <span className="text-[10px] sm:text-[11px] text-stone-400 line-through">
                  ৳{product.compare_at_price.toFixed(0)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addItem(product)}
            className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1 text-[11px] font-bold text-[#8d4c2d] bg-stone-50 hover:bg-[#8d4c2d] hover:text-white border border-stone-200 hover:border-[#8d4c2d] rounded-lg transition-all shadow-2xs"
            title="কার্টে যোগ করুন"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
