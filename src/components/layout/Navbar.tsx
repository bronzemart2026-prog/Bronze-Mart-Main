import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Phone } from 'lucide-react';
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
      <div className="bg-[#1a1512] text-[#ebd8bd] text-xs py-1.5 sm:py-2 px-3 sm:px-5 lg:px-6 border-b border-stone-800">
        <div className="max-w-[1500px] mx-auto">
          {/* Mobile Clean 2-Row Structured Bar */}
          <div className="flex sm:hidden flex-col gap-1.5 py-0.5">
            {/* Row 1: Delivery Offer */}
            <div className="flex items-center justify-center gap-1.5 text-center overflow-hidden">
              <span className="bg-[#8d4c2d] text-white text-[9px] font-bold px-2 py-0.2 rounded-full flex-shrink-0">
                অফার
              </span>
              <span className="text-stone-300 font-medium text-[10.5px] truncate">
                ফ্রি হোম ডেলিভারি (বাঁশখালী) ১০০০+ ৳ অর্ডারে | সারা দেশে ক্যাশ অন ডেলিভারি
              </span>
            </div>

            {/* Row 2: Call + WhatsApp + Facebook Buttons */}
            <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-stone-800/80">
              {/* Call Direct */}
              <a
                href="tel:01883360440"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8d4c2d]/25 text-[#ebd8bd] border border-[#ce9764]/50 text-[10.5px] font-bold hover:bg-[#8d4c2d]/40 hover:text-white transition-colors"
                title="সরাসরি কল করুন: ০১৮৮৩-৩৬০৪৪০"
              >
                <Phone className="w-3 h-3 text-[#ce9764]" />
                <span>কল: ০১৮৮৩-৩৬০৪৪০</span>
              </a>

              <div className="flex items-center gap-1.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801883360440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-[10.5px] font-semibold hover:bg-[#25D366]/25 transition-all shadow-xs"
                  title="হোয়াটসঅ্যাপে চ্যাট করুন: ০১৮৮৩-৩৬০৪৪০"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>হোয়াটসঅ্যাপ</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/people/Bronze-Mart/61589057942669/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1877F2]/15 border border-[#1877F2]/40 text-[#1877F2] text-[10.5px] font-semibold hover:bg-[#1877F2]/25 transition-all shadow-xs"
                  title="ফেসবুক পেজ ভিজিট করুন"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>ফেসবুক</span>
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Full bar */}
          <div className="hidden sm:flex items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="bg-[#8d4c2d] text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                ব্রোঞ্জ মার্ট
              </span>
              <span className="text-stone-300">
                ফ্রি হোম ডেলিভারি (বাঁশখালী) ১০০০+ টাকার অর্ডারে | সারা দেশে ক্যাশ অন ডেলিভারি
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Call Direct */}
              <a
                href="tel:01883360440"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8d4c2d]/25 hover:bg-[#8d4c2d]/40 text-[#ebd8bd] hover:text-white border border-[#ce9764]/50 rounded-full text-xs font-semibold transition-all hover:scale-105"
                title="সরাসরি কল করুন"
              >
                <Phone className="w-3.5 h-3.5 text-[#ce9764]" />
                <span>কল: ০১৮৮৩-৩৬০৪৪০</span>
              </a>

              {/* Official WhatsApp Button */}
              <a
                href="https://wa.me/8801883360440"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/40 rounded-full text-xs font-semibold transition-all hover:scale-105"
                title="হোয়াটসঅ্যাপে মেসেজ দিন"
              >
                <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>হোয়াটসঅ্যাপ</span>
              </a>

              {/* Facebook Link */}
              <a
                href="https://www.facebook.com/people/Bronze-Mart/61589057942669/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2] border border-[#1877F2]/40 rounded-full text-xs font-semibold transition-all hover:scale-105"
                title="আমাদের ফেসবুক পেজ ভিজিট করুন"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>ফেসবুক পেজ</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
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
              {/* Direct Call Button */}
              <a
                href="tel:01883360440"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 text-stone-900 font-bold border border-stone-200 hover:bg-[#8d4c2d]/10 hover:text-[#8d4c2d] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#8d4c2d]" />
                <span>সরাসরি কল করুন: ০১৮৮৩-৩৬০৪৪০</span>
              </a>

              {/* Official WhatsApp Button */}
              <a
                href="https://wa.me/8801883360440"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
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
                <span>হোয়াটসঅ্যাপ: ০১৮৮৩-৩৬০৪৪০</span>
              </a>

              {/* Facebook Page Button */}
              <a
                href="https://www.facebook.com/people/Bronze-Mart/61589057942669/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>ফেসবুক পেজ ভিজিট করুন</span>
              </a>

              {/* Email Button */}
              <a
                href="mailto:bronzemart2026@gmail.com"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold hover:bg-stone-200 transition-colors"
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
