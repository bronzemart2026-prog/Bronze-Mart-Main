'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" variant="dark" />
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              আপনার বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম—সেরা মানের পোশাক, অথেনটিক প্রসাধন ও লাইফস্টাইল পণ্য। কোয়ালিটি • ট্রাস্ট • ভ্যালু।
            </p>
            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="text-stone-400">সরাসরি কল:</span>
                <a
                  href="tel:01883360440"
                  className="inline-flex items-center gap-1.5 text-[#ce9764] hover:text-[#ebd8bd] font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ce9764]" />
                  <span>০১৮৮৩-৩৬০৪৪০</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-400">হোয়াটসঅ্যাপ:</span>
                <a
                  href="https://wa.me/8801883360440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-semibold"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M16 0C7.164 0 0 7.163 0 16c0 2.825.736 5.578 2.138 8.01L.073 31.927l8.118-2.019A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0z"
                      fill="#25D366"
                    />
                    <path
                      d="M24.773 20.334c-.365-1.026-1.89-1.928-2.618-2.029-.728-.1-1.455.152-1.819.516-.364.364-1.455 1.769-1.782 2.133-.327.364-.728.364-1.382.073-.655-.291-2.619-1.237-4.147-2.619-1.164-1.055-1.964-2.364-2.219-2.8-.255-.436-.036-.655.182-.873.182-.182.4-.473.618-.727.218-.255.291-.437.437-.728.145-.291.073-.545-.037-.764-.109-.218-1.018-2.437-1.382-3.346-.364-.91-.727-.764-1.018-.764-.255 0-.546.036-.837.036-.291 0-.764.109-1.164.545-.4.437-1.528 1.492-1.528 3.638 0 2.146 1.564 4.22 1.782 4.511.219.291 3.056 4.766 7.458 6.621 4.402 1.855 4.402 1.237 5.202 1.164.8-.073 2.619-1.055 2.983-2.11.364-1.055.364-1.964.255-2.146-.109-.182-.364-.291-.728-.473z"
                      fill="#fff"
                    />
                  </svg>
                  <span>০১৮৮৩-৩৬০৪৪০</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-400">ফেসবুক পেজ:</span>
                <a
                  href="https://www.facebook.com/people/Bronze-Mart/61589057942669/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#1877F2] hover:underline font-semibold"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Bronze Mart Facebook Page</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-400">ইমেইল হেল্পলাইন: </span>
                <a href="mailto:bronzemart2026@gmail.com" className="text-[#ce9764] hover:underline">
                  bronzemart2026@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Shop Departments */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">ক্যাটাগরি</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/products?category=womens-clothing" className="hover:text-white transition-colors">
                  মেয়েদের পোশাক
                </Link>
              </li>
              <li>
                <Link href="/products?category=mens-clothing" className="hover:text-white transition-colors">
                  ছেলেদের পোশাক
                </Link>
              </li>
              <li>
                <Link href="/products?category=cosmetics-skincare" className="hover:text-white transition-colors">
                  প্রসাধন ও স্কিনকেয়ার
                </Link>
              </li>
              <li>
                <Link href="/products?category=footwear-bags" className="hover:text-white transition-colors">
                  জুতো ও ব্যাগ
                </Link>
              </li>
              <li>
                <Link href="/products?category=jewelry-accessories" className="hover:text-white transition-colors">
                  গয়না ও এক্সেসরিজ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">গ্রাহক সেবা</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a
                  href="https://wa.me/8801883360440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  হোয়াটসঅ্যাপ সাপোর্ট
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  ডেলিভারি ও রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  যোগাযোগ করুন
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">যুক্ত থাকুন</h4>
            <p className="text-xs text-stone-400">
              নতুন অফার, ডিসকাউন্ট ও কালেকশন আপডেট পেতে ইমেইল সাবস্ক্রাইব করুন।
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="আপনার ইমেইল দিন"
                className="w-full px-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#8d4c2d]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#8d4c2d] hover:bg-[#a05633] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                aria-label="সাবস্ক্রাইব করুন"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500 border-t border-stone-800/80 mt-2">
          <div>
            &copy; {new Date().getFullYear()} ব্রোঞ্জ মার্ট। সর্বস্বত্ব সংরক্ষিত।
          </div>

          {/* Developer Credit with WhatsApp */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Developed by:</span>
            <a
              href="https://wa.me/8801825334505"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-[#8d4c2d]/20 border border-stone-700 hover:border-[#8d4c2d]/50 rounded-full text-stone-300 hover:text-white font-medium transition-all group shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#25D366] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.771.82 2.796.821 3.183 0 5.77-2.587 5.77-5.768.001-3.181-2.587-5.765-5.77-5.765zm0-2c4.288 0 7.769 3.48 7.77 7.766 0 4.288-3.482 7.77-7.77 7.77-1.328-.001-2.58-.337-3.687-.936l-4.344 1.139 1.159-4.236c-.663-1.15-1.028-2.464-1.028-3.737 0-4.286 3.482-7.766 7.77-7.766zm3.435 11.082c-.143.404-.716.738-1.024.787-.279.044-.645.078-1.849-.421-1.536-.636-2.528-2.186-2.605-2.288-.077-.103-.623-.83-.623-1.583 0-.753.395-1.124.536-1.27.141-.146.309-.182.412-.182.103 0 .207.001.297.005.096.004.225-.036.35.267.129.313.441 1.077.48 1.156.039.078.065.17.013.273-.052.103-.078.167-.155.257-.078.09-.163.201-.233.27-.078.077-.16.16-.068.318.092.158.409.675.877 1.091.603.537 1.111.704 1.269.782.158.078.25.068.343-.039.093-.107.399-.465.505-.625.107-.16.213-.133.359-.079.146.053.926.437 1.086.516.16.079.267.118.306.185.039.066.039.387-.104.791z" />
              </svg>
              <span className="font-bold text-white">MD ARIF UDDIN</span>
              <span className="text-stone-400">: 01825334505</span>
            </a>
          </div>

          <div className="flex gap-6">
            <Link href="/about" className="hover:text-stone-300">প্রাইভেসি পলিসি</Link>
            <Link href="/about" className="hover:text-stone-300">ব্যবহারের নিয়মাবলী</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
