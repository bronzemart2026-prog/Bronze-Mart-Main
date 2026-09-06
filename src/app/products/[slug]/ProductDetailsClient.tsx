'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  const discountPercent = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) * 100
      )
    : null;

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link href="/" className="hover:text-[#8d4c2d]">হোম</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#8d4c2d]">পণ্যসমূহ</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-[#8d4c2d]"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              fill
              priority
              className="object-cover object-center"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-[#8d4c2d] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                -{discountPercent}% ছাড়
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx
                      ? 'border-[#8d4c2d] ring-1 ring-[#8d4c2d]'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`থাম্বনেইল ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Actions & Details */}
        <div className="lg:col-span-6 flex flex-col">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-snug mb-3">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-stone-900">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400">({product.reviews_count} টি কাস্টমার রিভিউ)</span>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-stone-900">
              ৳{product.price.toFixed(0)}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-stone-400 line-through">
                ৳{product.compare_at_price.toFixed(0)}
              </span>
            )}
            <span className="text-xs text-emerald-700 font-semibold ml-auto flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> স্টকে আছে (ডেলিভারির জন্য প্রস্তুত)
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-700">পরিমাণ:</span>
              <div className="flex items-center border border-stone-200 bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-stone-50 text-stone-600 transition-colors"
                  aria-label="কমান"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-stone-50 text-stone-600 transition-colors"
                  aria-label="বাড়ান"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold transition-all shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>কার্টে যোগ করুন</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>সরাসরি অর্ডার করুন</span>
              </button>
            </div>

            {/* Direct WhatsApp Order CTA */}
            <a
              href={`https://wa.me/8801883360440?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি "${product.title}" (মূল্য: ৳${product.price.toFixed(0)}) পণ্যটি অর্ডার করতে চাই।`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all"
            >
              <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.771.82 2.796.821 3.183 0 5.77-2.587 5.77-5.768.001-3.181-2.587-5.765-5.77-5.765zm0-2c4.288 0 7.769 3.48 7.77 7.766 0 4.288-3.482 7.77-7.77 7.77-1.328-.001-2.58-.337-3.687-.936l-4.344 1.139 1.159-4.236c-.663-1.15-1.028-2.464-1.028-3.737 0-4.286 3.482-7.766 7.77-7.766zm3.435 11.082c-.143.404-.716.738-1.024.787-.279.044-.645.078-1.849-.421-1.536-.636-2.528-2.186-2.605-2.288-.077-.103-.623-.83-.623-1.583 0-.753.395-1.124.536-1.27.141-.146.309-.182.412-.182.103 0 .207.001.297.005.096.004.225-.036.35.267.129.313.441 1.077.48 1.156.039.078.065.17.013.273-.052.103-.078.167-.155.257-.078.09-.163.201-.233.27-.078.077-.16.16-.068.318.092.158.409.675.877 1.091.603.537 1.111.704 1.269.782.158.078.25.068.343-.039.093-.107.399-.465.505-.625.107-.16.213-.133.359-.079.146.053.926.437 1.086.516.16.079.267.118.306.185.039.066.039.387-.104.791z" />
              </svg>
              <span>হোয়াটসঅ্যাপে অর্ডার করুন (০১৮৮৩-৩৬০৪৪০)</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-stone-200 mb-8 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8d4c2d]" />
              <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8d4c2d]" />
              <span>সহজ রিটার্ন পলিসি</span>
            </div>
          </div>

          {/* Tabs (Specifications / Shipping) */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex gap-4 border-b border-stone-200 mb-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 text-xs font-bold transition-all ${
                  activeTab === 'details'
                    ? 'text-[#8d4c2d] border-b-2 border-[#8d4c2d]'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                বিবরণ
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 text-xs font-bold transition-all ${
                  activeTab === 'specs'
                    ? 'text-[#8d4c2d] border-b-2 border-[#8d4c2d]'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                স্পেসিফিকেশন
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 text-xs font-bold transition-all ${
                  activeTab === 'shipping'
                    ? 'text-[#8d4c2d] border-b-2 border-[#8d4c2d]'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                ডেলিভারি তথ্য
              </button>
            </div>

            {activeTab === 'details' && (
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {activeTab === 'specs' && product.specs && (
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">{key}</span>
                    <span className="text-stone-900 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <p className="text-xs text-stone-600 leading-relaxed">
                ঢাকার ভেতরে ২-৩ কার্যদিবস এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন করা হয়। পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধের সুবিধা রয়েছে।
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
