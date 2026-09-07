import React from 'react';
import type { Metadata } from 'next';
import { getCategories, getProducts } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import JsonLd from '@/components/common/JsonLd';
import Link from 'next/link';
import {
  SITE_NAME,
  SITE_NAME_BN,
  getBreadcrumbSchema,
  getItemListSchema,
  getCanonicalUrl,
} from '@/lib/seo';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categories = await getCategories();
  const selectedCategory = categories.find((c) => c.slug === params.category);

  if (params.search) {
    return {
      title: `"${params.search}" এর অনুসন্ধান ফলাফল | ${SITE_NAME}`,
      description: `ব্রোঞ্জ মার্টে "${params.search}" সম্পর্কিত সেরা পণ্য কালেকশন দেখুন।`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  if (selectedCategory) {
    const title = `${selectedCategory.name} কালেকশন | ${SITE_NAME}`;
    const description =
      selectedCategory.description ||
      `ব্রোঞ্জ মার্টে সেরা মানের ${selectedCategory.name} সাশ্রয়ী মূল্যে কিনুন। দ্রুত ক্যাশ অন ডেলিভারি সুবিধা।`;
    const canonical = `/products?category=${selectedCategory.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title: `${selectedCategory.name} - ${SITE_NAME_BN}`,
        description,
        url: canonical,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${selectedCategory.name} | ${SITE_NAME}`,
        description,
      },
    };
  }

  return {
    title: `সকল পণ্য কালেকশন | ${SITE_NAME}`,
    description:
      'ব্রোঞ্জ মার্টের আধুনিক পোশাক, প্রসাধন, স্কিনকেয়ার ও লাইফস্টাইল সামগ্রীর সম্পূর্ণ কালেকশন দেখুন। সেরা অফার ও দ্রুত হোম ডেলিভারি।',
    alternates: {
      canonical: '/products',
    },
    openGraph: {
      title: `সকল পণ্য কালেকশন - ${SITE_NAME_BN}`,
      description:
        'ব্রোঞ্জ মার্টের পোশাক, প্রসাধন, স্কিনকেয়ার ও লাইফস্টাইল সামগ্রীর সম্পূর্ণ কালেকশন।',
      url: '/products',
      type: 'website',
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categories = await getCategories();
  
  const selectedCategory = categories.find((c) => c.slug === params.category);
  
  const products = await getProducts({
    categoryId: selectedCategory?.id,
    categorySlug: params.category,
    search: params.search,
    sort: params.sort,
  });

  // Structured Data
  const breadcrumbItems = [
    { name: 'হোম', item: '/' },
    { name: 'পণ্যসমূহ', item: '/products' },
  ];
  if (selectedCategory) {
    breadcrumbItems.push({
      name: selectedCategory.name,
      item: `/products?category=${selectedCategory.slug}`,
    });
  }
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const listTitle = selectedCategory
    ? `${selectedCategory.name} কালেকশন - ${SITE_NAME}`
    : `সকল পণ্য কালেকশন - ${SITE_NAME}`;
  const listDescription =
    selectedCategory?.description ||
    'ব্রোঞ্জ মার্টের আধুনিক ফ্যাশন, স্কিনকেয়ার ও লাইফস্টাইল সামগ্রী।';

  const itemListSchema =
    products.length > 0
      ? getItemListSchema(
          listTitle,
          listDescription,
          products.map((p) => ({
            title: p.title,
            slug: p.slug,
            price: p.price,
            image: p.images?.[0],
          }))
        )
      : null;

  return (
    <div className="bg-white min-h-screen py-10">
      <JsonLd data={breadcrumbSchema} />
      {itemListSchema && <JsonLd data={itemListSchema} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-[#8d4c2d]">হোম</Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">
              {selectedCategory ? selectedCategory.name : 'সকল পণ্য'}
            </span>
            {params.search && (
              <>
                <span>/</span>
                <span className="text-stone-400">অনুসন্ধান: &quot;{params.search}&quot;</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
                {selectedCategory ? selectedCategory.name : 'সকল পণ্য কালেকশন'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                {selectedCategory?.description ||
                  'আমাদের সেরা মানের পোশাক, প্রসাধন, স্কিনকেয়ার, জুতো ও এক্সেসরিজ কালেকশন থেকে আপনার পছন্দের পণ্য বেছে নিন।'}
              </p>
            </div>

            {/* Product Count */}
            <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3.5 py-1.5 rounded-full self-start md:self-auto">
              {products.length} টি পণ্য পাওয়া গেছে
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <Link
            href="/products"
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              !params.category
                ? 'bg-[#8d4c2d] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            সকল ক্যাটাগরি
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                params.category === cat.slug
                  ? 'bg-[#8d4c2d] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-200 p-8">
            <h3 className="text-base font-bold text-stone-900 mb-1">কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 mb-6">
              আপনার খোঁজা অনুযায়ী কোনো পণ্য এই মুহূর্তে খুঁজে পাওয়া যায়নি।
            </p>
            <Link
              href="/products"
              className="inline-flex px-6 py-2.5 bg-[#8d4c2d] text-white text-xs font-semibold rounded-xl hover:bg-[#743e2a] transition-colors"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

