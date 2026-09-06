import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white py-16 lg:py-24">
      {/* Background visual image */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80"
          alt="ফ্যাশন ও প্রসাধন স্টোর"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6 text-center sm:text-left">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-stone-200 backdrop-blur-sm">
            নতুন সিজন কালেকশন ২০২৬
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
            আধুনিক ফ্যাশন, খাঁটি প্রসাধন ও লাইফস্টাইল পণ্য।
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-lg">
            সেরা মানের প্রিমিয়াম পোশাক, ত্বকের যত্নে ১০০% অথেনটিক স্কিনকেয়ার এবং ট্রেন্ডি এক্সেসরিজ কালেকশন সাশ্রয়ী মূল্যে বেছে নিন।
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#8d4c2d] hover:bg-[#a05633] text-white text-xs font-bold transition-all shadow-lg"
            >
              <span>সকল পণ্য দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products?category=cosmetics-skincare"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all backdrop-blur-sm"
            >
              <span>প্রসাধন সামগ্রী দেখুন</span>
            </Link>
          </div>

          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-white/10 text-center sm:text-left">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">১০০%</div>
              <div className="text-xs text-stone-400">খাঁটি ও অরিজিনাল</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">দ্রুত</div>
              <div className="text-xs text-stone-400">ক্যাশ অন ডেলিভারি</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">সহজ</div>
              <div className="text-xs text-stone-400">রিটার্ন সুবিধা</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
