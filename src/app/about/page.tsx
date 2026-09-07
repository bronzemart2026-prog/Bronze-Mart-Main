import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Heart, Truck } from 'lucide-react';
import JsonLd from '@/components/common/JsonLd';
import { SITE_NAME, SITE_NAME_BN, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `আমাদের সম্পর্কে | ${SITE_NAME}`,
  description:
    'ব্রোঞ্জ মার্টের মূল লক্ষ্য হলো বাংলাদেশের প্রতিটি ঘরে আধুনিক ও রুচিশীল পোশাক, আসল কসমেটিকস ও স্কিনকেয়ার সামগ্রী সাশ্রয়ী মূল্যে পৌঁছে দেওয়া।',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `আমাদের সম্পর্কে - ${SITE_NAME} | ${SITE_NAME_BN}`,
    description:
      'ব্রোঞ্জ মার্টের গল্প, কোয়ালিটি, সেবা এবং ১০০% আসল পণ্যের প্রতিশ্রুতি সম্পর্কে বিস্তারিত জানুন।',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/about#aboutpage`,
    name: `আমাদের সম্পর্কে - ${SITE_NAME}`,
    description:
      'ব্রোঞ্জ মার্টের মূল লক্ষ্য হলো বাংলাদেশের প্রতিটি ঘরে আধুনিক ও রুচিশীল পোশাক, আসল কসমেটিকস ও স্কিনকেয়ার সামগ্রী সাশ্রয়ী মূল্যে পৌঁছে দেওয়া।',
    url: `${SITE_URL}/about`,
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <JsonLd data={aboutSchema} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            আমাদের গল্প
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            ব্রোঞ্জ মার্ট - কোয়ালিটি, ট্রাস্ট ও ভ্যালু
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            ব্রোঞ্জ মার্টের মূল লক্ষ্য হলো বাংলাদেশের প্রতিটি ঘরে আধুনিক ও রুচিশীল পোশাক, আসল কসমেটিকস ও স্কিনকেয়ার সামগ্রী সাশ্রয়ী মূল্যে পৌঁছে দেওয়া।
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#8d4c2d] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">সেরা মান ও স্থায়িত্ব</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              আমাদের প্রতিটি পোশাক ও সামগ্রী নিজস্ব মাননিয়ন্ত্রণ টিম দ্বারা যাচাইকৃত এবং সর্বোচ্চ আরামদায়ক ফ্যাব্রিকে তৈরি।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#8d4c2d] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">১০০% অথেনটিক স্কিনকেয়ার</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              ত্বকের সুরক্ষায় আমরা সরবরাহ করি সম্পূর্ণ খাঁটি ও ক্ষতিকর উপাদানমুক্ত আসল ব্র্যান্ডের প্রসাধন ও সিরাম।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#8d4c2d] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">দ্রুত ডেলিভারি ও সাপোর্ট</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              সারা দেশে ক্যাশ অন ডেলিভারি সুবিধা এবং যেকোনো প্রয়োজনে সার্বক্ষণিক কাস্টমার কেয়ার সহায়তা।
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-stone-900 rounded-3xl p-10 text-white text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            আমাদের নতুন কালেকশন দেখুন
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            আপনার পছন্দের পোশাক ও প্রয়োজনীয় সামগ্রী সহজে অর্ডার করুন আজই।
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8d4c2d] hover:bg-[#a05633] text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              <span>সকল পণ্য দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

