import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `আমার অ্যাকাউন্ট | ${SITE_NAME}`,
  description: 'আপনার প্রোফাইল ও অর্ডারের বিবরণ।',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
