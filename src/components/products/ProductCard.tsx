'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Star, Eye, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const discountPercent = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) * 100
      )
    : null;

  const defaultImg =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleDirectOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    router.push('/checkout');
  };

  return (
    <div className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white border border-stone-200/90 hover:border-[#8d4c2d]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Fitted Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100/80">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
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
            <span className="rounded-md bg-[#8d4c2d] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              -{discountPercent}%
            </span>
          ) : null}
          {product.is_trending && (
            <span className="rounded-md bg-stone-900/90 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              ট্রেন্ডিং
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
          <Link
            href={`/products/${product.slug}`}
            className="p-2.5 bg-white/95 text-stone-800 rounded-full hover:bg-white hover:scale-110 transition-all shadow-md pointer-events-auto"
            title="পণ্যটি বিস্তারিত দেখুন"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-[#8d4c2d] text-white rounded-full hover:bg-[#743e2a] hover:scale-110 transition-all shadow-md pointer-events-auto"
            title="কার্টে যোগ করুন"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
          <span className="truncate font-medium max-w-[100px] sm:max-w-[120px] text-stone-500">
            {product.category?.name || 'ফ্যাশন'}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold flex-shrink-0">
            <Star className="w-3 h-3 fill-current" />
            <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="group-hover:text-[#8d4c2d] transition-colors mb-2 block"
        >
          <h3 className="font-bold text-stone-900 text-xs sm:text-[13px] line-clamp-2 leading-snug min-h-[34px] sm:min-h-[36px]">
            {product.title}
          </h3>
        </Link>

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-2 border-t border-stone-100 space-y-2.5">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-stone-900">
              ৳{product.price.toFixed(0)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-stone-400 line-through">
                ৳{product.compare_at_price.toFixed(0)}
              </span>
            )}
          </div>

          {/* Action Buttons: Cart + Order */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 rounded-xl transition-colors cursor-pointer"
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
              <span>কার্টে যোগ</span>
            </button>

            <button
              onClick={handleDirectOrder}
              className="w-full flex items-center justify-center gap-1 py-2 px-1.5 text-xs font-bold text-white bg-[#8d4c2d] hover:bg-[#743e2a] rounded-xl transition-all shadow-xs hover:shadow cursor-pointer"
              title="সরাসরি চেকআউটে যান"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


