import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/api';
import ProductDetailsClient from './ProductDetailsClient';
import ProductCard from '@/components/products/ProductCard';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'পণ্যটি পাওয়া যায়নি | ব্রোঞ্জ মার্ট',
    };
  }

  return {
    title: `${product.title} | ব্রোঞ্জ মার্ট`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
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

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
