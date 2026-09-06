'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { useCartStore } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/types';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  const openCart = useCartStore((state) => state.openCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    getCategories().then((cats) => {
      setCategories(cats);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      {/* Top Utility & Announcement Bar */}
      <div className="bg-[#1a1512] text-[#ebd8bd] text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-[#8d4c2d] text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full">
              ব্রোঞ্জ মার্ট
            </span>
            <span className="text-stone-300">
              ফ্রি হোম ডেলিভারি (INSIDE BANSKHALI) ১০০০+ টাকার অর্ডারে | সারা দেশে ক্যাশ অন ডেলিভারি
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/8801883360440"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-700/60 rounded-full text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.771.82 2.796.821 3.183 0 5.77-2.587 5.77-5.768.001-3.181-2.587-5.765-5.77-5.765zm0-2c4.288 0 7.769 3.48 7.77 7.766 0 4.288-3.482 7.77-7.77 7.77-1.328-.001-2.58-.337-3.687-.936l-4.344 1.139 1.159-4.236c-.663-1.15-1.028-2.464-1.028-3.737 0-4.286 3.482-7.766 7.77-7.766zm3.435 11.082c-.143.404-.716.738-1.024.787-.279.044-.645.078-1.849-.421-1.536-.636-2.528-2.186-2.605-2.288-.077-.103-.623-.83-.623-1.583 0-.753.395-1.124.536-1.27.141-.146.309-.182.412-.182.103 0 .207.001.297.005.096.004.225-.036.35.267.129.313.441 1.077.48 1.156.039.078.065.17.013.273-.052.103-.078.167-.155.257-.078.09-.163.201-.233.27-.078.077-.16.16-.068.318.092.158.409.675.877 1.091.603.537 1.111.704 1.269.782.158.078.25.068.343-.039.093-.107.399-.465.505-.625.107-.16.213-.133.359-.079.146.053.926.437 1.086.516.16.079.267.118.306.185.039.066.039.387-.104.791z" />
              </svg>
              <span>হোয়াটসঅ্যাপ: ০১৮৮৩-৩৬০৪৪০</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="মেনু খুলুন"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700">
              <Link href="/" className="hover:text-[#8d4c2d] transition-colors">
                হোম
              </Link>
              <Link href="/products" className="hover:text-[#8d4c2d] transition-colors">
                সকল পণ্য
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-[#8d4c2d] transition-colors py-2">
                  <span>ক্যাটাগরি</span>
                  <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 w-60 p-2 bg-white rounded-2xl shadow-xl border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="block px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-[#8d4c2d] rounded-xl transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/about" className="hover:text-[#8d4c2d] transition-colors">
                আমাদের সম্পর্কে
              </Link>
            </nav>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative"
            >
              <input
                type="text"
                placeholder="পোশাক, প্রসাধন, জুতো বা ব্যাগ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:border-[#8d4c2d] focus:bg-white text-stone-900 placeholder-stone-400 transition-colors"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Right Actions (Cart Trigger) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white rounded-xl shadow-xs transition-all duration-200"
                aria-label="শপিং কার্ট"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-bold">কার্ট</span>
                {totalItems > 0 && (
                  <span className="bg-stone-900 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:border-[#8d4c2d] text-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-stone-800"
            >
              হোম
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-stone-800"
            >
              সকল পণ্য
            </Link>
            <div className="pt-2 border-t border-stone-100">
              <div className="text-xs uppercase font-bold text-stone-400 mb-2">ক্যাটাগরি সমূহ</div>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 text-xs font-medium text-stone-600 hover:text-[#8d4c2d]"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-stone-800 border-t border-stone-100"
            >
              আমাদের সম্পর্কে
            </Link>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
              <a
                href="https://wa.me/8801883360440"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.771.82 2.796.821 3.183 0 5.77-2.587 5.77-5.768.001-3.181-2.587-5.765-5.77-5.765zm0-2c4.288 0 7.769 3.48 7.77 7.766 0 4.288-3.482 7.77-7.77 7.77-1.328-.001-2.58-.337-3.687-.936l-4.344 1.139 1.159-4.236c-.663-1.15-1.028-2.464-1.028-3.737 0-4.286 3.482-7.766 7.77-7.766zm3.435 11.082c-.143.404-.716.738-1.024.787-.279.044-.645.078-1.849-.421-1.536-.636-2.528-2.186-2.605-2.288-.077-.103-.623-.83-.623-1.583 0-.753.395-1.124.536-1.27.141-.146.309-.182.412-.182.103 0 .207.001.297.005.096.004.225-.036.35.267.129.313.441 1.077.48 1.156.039.078.065.17.013.273-.052.103-.078.167-.155.257-.078.09-.163.201-.233.27-.078.077-.16.16-.068.318.092.158.409.675.877 1.091.603.537 1.111.704 1.269.782.158.078.25.068.343-.039.093-.107.399-.465.505-.625.107-.16.213-.133.359-.079.146.053.926.437 1.086.516.16.079.267.118.306.185.039.066.039.387-.104.791z" />
                </svg>
                <span>হোয়াটসঅ্যাপ: ০১৮৮৩-৩৬০৪৪০</span>
              </a>
              <a
                href="mailto:bronzemart2026@gmail.com"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold"
              >
                <span>✉️ bronzemart2026@gmail.com</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
