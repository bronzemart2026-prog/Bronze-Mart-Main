import type { Metadata } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppWidget from '@/components/common/WhatsAppWidget';

import StoreLayoutShell from '@/components/layout/StoreLayoutShell';

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Bronze Mart',
    template: '%s | Bronze Mart',
  },
  description:
    'ব্রোঞ্জ মার্টে সেরা মানের পোশাক, প্রসাধন ও স্কিনকেয়ার, জুতো, ব্যাগ এবং লাইফস্টাইল সামগ্রী সাশ্রয়ী মূল্যে কিনুন। দ্রুত ক্যাশ অন ডেলিভারি ও সহজ রিটার্ন সুবিধা।',
  icons: {
    icon: '/logo-mark.png',
    shortcut: '/logo-mark.png',
    apple: '/logo-mark.png',
  },
  keywords: [
    'Bronze Mart',
    'ব্রোঞ্জ মার্ট',
    'অনলাইন শপিং',
    'ছেলেদের পোশাক',
    'মেয়েদের পোশাক',
    'কসমেটিকস',
    'স্কিনকেয়ার',
    'জুতো ও ব্যাগ',
    'অনলাইন শপ বাংলাদেশ',
  ],
  openGraph: {
    title: 'Bronze Mart',
    description: 'উচ্চমানের পোশাক, খাঁটি প্রসাধন ও নিত্যপ্রয়োজনীয় সামগ্রী।',
    type: 'website',
    images: ['/logo-mark.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={`h-full antialiased scroll-smooth ${hindSiliguri.variable} ${hindSiliguri.className}`}
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900">
        <StoreLayoutShell>{children}</StoreLayoutShell>
      </body>
    </html>
  );
}
