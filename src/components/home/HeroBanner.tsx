'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Tag, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  image: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  stats: {
    val: string;
    label: string;
  }[];
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'নতুন সিজন কালেকশন ২০২৬',
    badgeIcon: <Tag className="w-3.5 h-3.5 text-amber-300" />,
    title: 'আধুনিক ফ্যাশন ও প্রিমিয়াম পোশাক কালেকশন',
    subtitle:
      'সেরা মানের রুচিশীল পোশাক, ট্রেন্ডি আউটফিট ও আরামদায়ক ফ্যাশন সামগ্রী সাশ্রয়ী মূল্যে বেছে নিন।',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
    primaryCtaText: 'পোশাক কালেকশন দেখুন',
    primaryCtaLink: '/products?category=womens-clothing',
    secondaryCtaText: 'সকল পণ্য',
    secondaryCtaLink: '/products',
    stats: [
      { val: '১০০%', label: 'প্রিমিয়াম ফ্যাব্রিক' },
      { val: 'সারা দেশে', label: 'ক্যাশ অন ডেলিভারি' },
      { val: '৭ দিন', label: 'সহজ রিটার্ন' },
    ],
  },
  {
    id: 2,
    tag: '১০০% অথেনটিক বিউটি ব্র্যান্ডস',
    badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    title: 'খাঁটি রূপচর্চা ও প্রিমিয়াম স্কিনকেয়ার সামগ্রী',
    subtitle:
      'ত্বকের যত্নে সম্পূর্ণ ক্ষতিকর উপাদানমুক্ত আসল ব্র্যান্ডের প্রসাধন, সিরাম, ক্রিম ও লোশন কিনুন নিরাপদে।',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80',
    primaryCtaText: 'স্কিনকেয়ার সামগ্রী দেখুন',
    primaryCtaLink: '/products?category=cosmetics-skincare',
    secondaryCtaText: 'সকল কালেকশন',
    secondaryCtaLink: '/products',
    stats: [
      { val: '১০০%', label: 'খাঁটি ও অরিজিনাল' },
      { val: 'ত্বকের সুরক্ষা', label: 'টেস্টেড ফর্মুলা' },
      { val: 'দ্রুত ডেলিভারি', label: 'নিরাপদ প্যাকেজিং' },
    ],
  },
  {
    id: 3,
    tag: 'ট্রেন্ডি ফুটওয়্যার ও এক্সেসরিজ',
    badgeIcon: <ShoppingBag className="w-3.5 h-3.5 text-[#ce9764]" />,
    title: 'লেটেস্ট ডিজাইন জুতো, ব্যাগ ও লাইফস্টাইল',
    subtitle:
      'দৈনন্দিন ব্যবহার ও উৎসবের জন্য আকর্ষণীয় ডিজাইনের জুতো, ব্যাগ, ঘড়ি ও প্রয়োজনীয় লাইফস্টাইল অনুষঙ্গ।',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    primaryCtaText: 'ব্যাগ ও জুতো দেখুন',
    primaryCtaLink: '/products?category=footwear-bags',
    secondaryCtaText: 'সকল পণ্য',
    secondaryCtaLink: '/products',
    stats: [
      { val: 'নতুন কালেকশন', label: 'আধুনিক ডিজাইন' },
      { val: 'সেরা মান', label: 'দীর্ঘস্থায়ী স্থায়িত্ব' },
      { val: 'সাশ্রয়ী মূল্য', label: 'সেরা অফার' },
    ],
  },
  {
    id: 4,
    tag: 'বিশেষ ফ্রি ডেলিভারি অফার',
    badgeIcon: <Truck className="w-3.5 h-3.5 text-amber-300" />,
    title: 'বাঁশখালীর ভেতরে ফ্রি হোম ডেলিভারি সুবিধা',
    subtitle:
      '১০০০ টাকার অধিক যেকোনো কেনাকাটায় বাঁশখালীর ভেতরে পান সম্পূর্ণ ফ্রি ডেলিভারি ও দ্রুত কাস্টমার সাপোর্ট।',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80',
    primaryCtaText: 'অর্ডার করুন আজই',
    primaryCtaLink: '/products',
    secondaryCtaText: 'আমাদের সম্পর্কে',
    secondaryCtaLink: '/about',
    stats: [
      { val: '০ ৳', label: 'বাঁশখালীতে ডেলিভারি ফি*' },
      { val: '২৪/৭', label: 'কাস্টমার কেয়ার' },
      { val: 'সহজ', label: 'বিকাশ ও সিওডি' },
    ],
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance slides every 2 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <section
      className="relative overflow-hidden bg-stone-950 text-white min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Carousel"
    >
      {/* Background Images with Fade Transition */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-stone-950/30" />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      ))}

      {/* Main Slide Content */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-2xl space-y-5 text-center sm:text-left">
          {/* Animated Tag Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-stone-200 backdrop-blur-md shadow-xs animate-fadeIn">
            {slides[currentSlide].badgeIcon}
            <span>{slides[currentSlide].tag}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white transition-all duration-500">
            {slides[currentSlide].title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-stone-300 leading-relaxed max-w-lg transition-all duration-500">
            {slides[currentSlide].subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={slides[currentSlide].primaryCtaLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#8d4c2d] hover:bg-[#a05633] text-white text-xs font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <span>{slides[currentSlide].primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={slides[currentSlide].secondaryCtaLink}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all backdrop-blur-sm"
            >
              <span>{slides[currentSlide].secondaryCtaText}</span>
            </Link>
          </div>

          {/* Stats Badges */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
            {slides[currentSlide].stats.map((stat, i) => (
              <div key={i}>
                <div className="text-base sm:text-lg lg:text-xl font-bold text-white">
                  {stat.val}
                </div>
                <div className="text-[11px] text-stone-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-[#8d4c2d] text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-110 hidden sm:flex items-center justify-center shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-[#8d4c2d] text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-110 hidden sm:flex items-center justify-center shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              index === currentSlide
                ? 'w-6 bg-[#8d4c2d]'
                : 'w-1.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
