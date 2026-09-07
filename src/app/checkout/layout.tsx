import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `নিরাপদ চেকআউট | ${SITE_NAME}`,
  description: 'আপনার অর্ডার সম্পন্ন করুন।',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
