'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingFee,
    getTotalItems,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = subtotal + shipping;
  const freeShippingThreshold = 1000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8d4c2d]" />
              <h2 className="text-base font-bold text-stone-900">আপনার কার্ট / ব্যাগ</h2>
              <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-semibold">
                {getTotalItems()} টি পণ্য
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-stone-50 p-4 border-b border-stone-200">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-700 mb-1.5">
              <Truck className="w-4 h-4 text-[#8d4c2d]" />
              {amountToFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">অভিনন্দন! আপনি পাচ্ছেন ফ্রি হোম ডেলিভারি!</span>
              ) : (
                <span>
                  ফ্রি ডেলিভারির জন্য আরও <strong className="text-[#8d4c2d]">৳{amountToFreeShipping.toFixed(0)}</strong> টাকার পণ্য যোগ করুন
                </span>
              )}
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8d4c2d] h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mb-1">আপনার কার্ট খালি</h3>
                <p className="text-xs text-stone-500 mb-6 max-w-xs">
                  পছন্দের পোশাক, প্রসাধন বা অন্যান্য সামগ্রী যোগ করে কেনাকাটা শুরু করুন।
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-[#8d4c2d] text-white text-xs font-bold rounded-xl hover:bg-[#743e2a] transition-colors shadow-xs"
                >
                  কেনাকাটা করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                    <Image
                      src={
                        item.product.images?.[0] ||
                        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={item.product.title}
                      fill
                      className="object-cover object-center"
                      unoptimized
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-stone-900 hover:text-[#8d4c2d] line-clamp-2"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedVariant)}
                          className="text-stone-400 hover:text-red-500 p-1 transition-colors ml-2"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-stone-900 mt-1">
                        ৳{item.product.price.toFixed(0)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 bg-white rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedVariant
                            )
                          }
                          className="p-1 px-2 hover:bg-stone-50 text-stone-600 transition-colors"
                          aria-label="কমান"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedVariant
                            )
                          }
                          className="p-1 px-2 hover:bg-stone-50 text-stone-600 transition-colors"
                          aria-label="বাড়ান"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-stone-900">
                        ৳{(item.product.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>মোট পণ্যের দাম (Subtotal)</span>
                  <span className="font-semibold text-stone-900">৳{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-[11px] font-semibold text-stone-700">
                    চট্টগ্রাম ৳৭০ / বাইরে ৳১৫০
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>সর্বমোট (Total)</span>
                  <span className="text-[#8d4c2d]">৳{total.toFixed(0)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <span>অর্ডার কনফার্ম করতে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
