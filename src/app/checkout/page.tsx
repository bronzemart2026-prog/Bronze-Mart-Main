'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { createOrder } from '@/lib/api';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  AlertCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delivery Zone State (Inside Chittagong = 70, Outside = 150)
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: 'চট্টগ্রাম',
    state: '',
    postalCode: '',
    country: 'বাংলাদেশ',
    paymentMethod: 'cod' as 'cod' | 'card' | 'bkash' | 'stripe',
    notes: '',
  });

  const subtotal = getSubtotal();
  const shippingFee = deliveryArea === 'inside' ? 70 : 150;
  const total = subtotal + shippingFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeliveryAreaChange = (area: 'inside' | 'outside') => {
    setDeliveryArea(area);
    if (area === 'inside' && formData.city !== 'চট্টগ্রাম') {
      setFormData((prev) => ({ ...prev, city: 'চট্টগ্রাম' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('আপনার কার্ট খালি। অর্ডার সম্পন্ন করতে পণ্য যোগ করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const areaLabel = deliveryArea === 'inside' ? 'চট্টগ্রাম সিটির ভেতরে (৳৭০)' : 'চট্টগ্রামের বাইরে (৳১৫০)';
      
      const res = await createOrder({
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: {
          street: formData.street,
          city: formData.city || (deliveryArea === 'inside' ? 'চট্টগ্রাম' : 'অন্যান্য'),
          state: `${formData.state || ''} [${areaLabel}]`.trim(),
          postal_code: formData.postalCode,
          country: formData.country,
        },
        total_amount: total,
        delivery_charge: shippingFee,
        is_delivery_paid: formData.paymentMethod !== 'cod',
        payment_method: formData.paymentMethod,
        notes: formData.notes ? `${formData.notes} | ডেলিভারি অঞ্চল: ${areaLabel}` : `ডেলিভারি অঞ্চল: ${areaLabel}`,
        items: items.map((item) => ({
          product_id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image_url: item.product.images[0],
        })),
      });

      if (res.success && res.orderId) {
        clearCart();
        router.push(`/checkout/success?orderId=${res.orderId}`);
      } else {
        setErrorMessage(res.error || 'অর্ডার সম্পন্ন করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'একটি সমস্যা দেখা দিয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-500 mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          আপনার কার্ট বর্তমানে খালি
        </h2>
        <p className="text-xs text-stone-500 mb-6 max-w-sm">
          চেকআউট করার পূর্বে অনুগ্রহ করে পছন্দের পণ্যসমূহ কার্টে যোগ করুন।
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#8d4c2d] text-white text-xs font-bold rounded-xl hover:bg-[#743e2a] transition-colors"
        >
          পণ্য দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#8d4c2d]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>কেনাকাটা চালিয়ে যান</span>
          </Link>
          <h1 className="text-3xl font-bold text-stone-900 mt-2">
            অর্ডার চেকআউট
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer Information, Shipping Area & Address */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Delivery Area Selector */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8d4c2d]" />
                  <span>১. ডেলিভারি এলাকা নির্বাচন করুন *</span>
                </h3>
                <span className="text-[11px] text-stone-500">চট্টগ্রাম: ৳৭০ | বাইরে: ৳১৫০</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Inside Chittagong */}
                <div
                  onClick={() => handleDeliveryAreaChange('inside')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    deliveryArea === 'inside'
                      ? 'border-[#8d4c2d] bg-[#8d4c2d]/5 ring-1 ring-[#8d4c2d]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        deliveryArea === 'inside' ? 'border-[#8d4c2d] bg-[#8d4c2d]' : 'border-stone-400'
                      }`}>
                        {deliveryArea === 'inside' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-stone-900">
                        চট্টগ্রাম সিটির ভেতরে
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 pl-6">
                      হোম ডেলিভারি (২-৩ কার্যদিবস)
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-black font-mono text-[#8d4c2d]">৳৭০</span>
                  </div>
                </div>

                {/* Outside Chittagong */}
                <div
                  onClick={() => handleDeliveryAreaChange('outside')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    deliveryArea === 'outside'
                      ? 'border-[#8d4c2d] bg-[#8d4c2d]/5 ring-1 ring-[#8d4c2d]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        deliveryArea === 'outside' ? 'border-[#8d4c2d] bg-[#8d4c2d]' : 'border-stone-400'
                      }`}>
                        {deliveryArea === 'outside' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-stone-900">
                        চট্টগ্রামের বাইরে (সারাদেশে)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 pl-6">
                      কুরিয়ার হোম ডেলিভারি (৩-৫ কার্যদিবস)
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-black font-mono text-[#8d4c2d]">৳১৫০</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Contact Details */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                ২. যোগাযোগের তথ্য
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    আপনার পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="যেমন: মোঃ করিম হাসান"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    মোবাইল নম্বর (ডেলিভারির জন্য আবশ্যক) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  ইমেইল ঠিকানা (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                />
              </div>
            </div>

            {/* 3. Shipping Address */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                ৩. ডেলিভারির পূর্ণ ঠিকানা
              </h3>
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  বাসা/ফ্ল্যাট নং, রোড নং, এলাকা ও ল্যান্ডমার্ক *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  placeholder={deliveryArea === 'inside' ? 'বাড়ি নং- ১২, রোড- ৪, জিইসি মোড়, চট্টগ্রাম' : 'বাড়ি নং- ১২, রোড- ৪, সেক্টর- ৩, উত্তরা, ঢাকা'}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    জেলা / শহর *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="চট্টগ্রাম / ঢাকা / সিলেট"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    থানা / উপজেলা
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="কোতোয়ালী / বাঁশখালী"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    পোস্ট কোড
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="৪০০০"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                ৪. পেমেন্ট মাধ্যম নির্বাচন করুন
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#8d4c2d] bg-stone-50 ring-1 ring-[#8d4c2d]'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-stone-900 mb-1">ক্যাশ অন ডেলিভারি</span>
                  <span className="text-[11px] text-stone-500">পণ্য হাতে পেয়ে মূল্য পরিশোধ</span>
                </label>

                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'bkash'
                      ? 'border-[#8d4c2d] bg-stone-50 ring-1 ring-[#8d4c2d]'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={formData.paymentMethod === 'bkash'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-stone-900 mb-1">বিকাশ / নগদ</span>
                  <span className="text-[11px] text-stone-500">মোবাইল ওয়ালেটে পেমেন্ট</span>
                </label>

                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#8d4c2d] bg-stone-50 ring-1 ring-[#8d4c2d]'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs text-stone-900 mb-1">ভিসা / মাস্টারকার্ড</span>
                  <span className="text-[11px] text-stone-500">ক্রেডিট ও ডেবিট কার্ড</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs sticky top-28 space-y-6">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
                অর্ডার সারাংশ ({items.length} টি পণ্য)
              </h3>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                      <Image
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-stone-500">পরিমাণ: {item.quantity}</p>
                    </div>
                    <div className="text-xs font-bold text-stone-900 font-mono">
                      ৳{(item.product.price * item.quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-xs pt-4 border-t border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>মোট পণ্যের দাম (Subtotal)</span>
                  <span className="font-semibold text-stone-900 font-mono">৳{subtotal.toFixed(0)}</span>
                </div>
                
                <div className="flex justify-between items-center text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                      {deliveryArea === 'inside' ? 'চট্টগ্রাম' : 'বাইরে'}
                    </span>
                  </div>
                  <span className="font-bold text-stone-900 font-mono">
                    ৳{shippingFee.toFixed(0)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-stone-900 pt-3 border-t border-stone-100">
                  <span>সর্বমোট বিল (Total)</span>
                  <span className="text-[#8d4c2d] font-mono text-base">৳{total.toFixed(0)}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoading ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার কনফার্ম করুন (৳${total.toFixed(0)})`}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>১০০% নিরাপদ ও সুরক্ষিত চেকআউট</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
