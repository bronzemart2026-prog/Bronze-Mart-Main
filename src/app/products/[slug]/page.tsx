import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/api';
import ProductDetailsClient from './ProductDetailsClient';
import ProductCard from '@/components/products/ProductCard';
import JsonLd from '@/components/common/JsonLd';
import {
  SITE_URL,
  SITE_NAME,
  SITE_NAME_BN,
  DEFAULT_OG_IMAGE,
  getProductSchema,
  getBreadcrumbSchema,
} from '@/lib/seo';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: `পণ্যটি পাওয়া যায়নি | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.title} | ${SITE_NAME}`;
  const description =
    product.description ||
    `ব্রোঞ্জ মার্টে সেরা মূল্যে কিনুন ${product.title}। দ্রুত হোম ডেলিভারি ও সহজে রিটার্ন সুবিধা।`;
  const canonical = `/products/${product.slug}`;
  const imageUrls =
    product.images && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith('http')
            ? img
            : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`
        )
      : [`${SITE_URL}/logo.png`];

  const keywords = [
    product.title,
    `${product.title} price in BD`,
    `${product.title} কিনুন`,
    product.category?.name || 'ফ্যাশন ও লাইফস্টাইল',
    'Bronze Mart',
    'ব্রোঞ্জ মার্ট',
    'ক্যাশ অন ডেলিভারি',
    'অনলাইন শপিং বাংলাদেশ',
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${product.title} | ${SITE_NAME_BN}`,
      description,
      url: canonical,
      siteName: `${SITE_NAME} - ${SITE_NAME_BN}`,
      locale: 'bn_BD',
      alternateLocale: ['en_US'],
      type: 'website',
      images: imageUrls.map((url) => ({
        url,
        width: 800,
        height: 800,
        alt: `${product.title} - Bronze Mart`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrls,
      creator: '@BronzeMart',
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'BDT',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:brand': SITE_NAME,
      'product:condition': 'new',
      'product:retailer_item_id': `BM-${product.id.slice(0, 8).toUpperCase()}`,
      'og:price:amount': product.price.toString(),
      'og:price:currency': 'BDT',
      'fb:app_id': '61589057942669',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (
    await getProducts({
      categoryId: product.category_id || undefined,
      limit: 3,
    })
  ).filter((p) => p.id !== product.id);

  // Schema.org Structured Data
  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'হোম', item: '/' },
    { name: 'পণ্যসমূহ', item: '/products' },
    ...(product.category
      ? [
          {
            name: product.category.name,
            item: `/products?category=${product.category.slug}`,
          },
        ]
      : []),
    { name: product.title, item: `/products/${product.slug}` },
  ]);

  return (
    <div className="bg-white min-h-screen py-10">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6">
        {/* Interactive Client View */}
        <ProductDetailsClient product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-200">
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                সাদৃশ্যপূর্ণ পণ্য
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1">
                আপনার আরও পছন্দ হতে পারে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

