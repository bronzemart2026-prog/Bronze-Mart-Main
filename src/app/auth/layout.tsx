import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `লগইন ও সাইনআপ | ${SITE_NAME}`,
  description: 'ব্রোঞ্জ মার্টে লগইন করুন বা নতুন অ্যাকাউন্ট তৈরি করুন।',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
