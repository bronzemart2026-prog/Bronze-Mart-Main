'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '@/lib/api';
import { Product, Category } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formComparePrice, setFormComparePrice] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formDescription, setFormDescription] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsTrending, setFormIsTrending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    setProducts(fetchedProducts);
    setCategories(fetchedCategories);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategoryId(categories[0]?.id || '');
    setFormPrice('');
    setFormComparePrice('');
    setFormStock('20');
    setFormDescription('');
    setFormImages([]);
    setImageUrlInput('');
    setFormIsFeatured(false);
    setFormIsTrending(false);
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormSlug(product.slug);
    setFormCategoryId(product.category_id || product.category?.id || '');
    setFormPrice(String(product.price));
    setFormComparePrice(product.compare_at_price ? String(product.compare_at_price) : '');
    setFormStock(String(product.stock));
    setFormDescription(product.description || '');
    setFormImages(product.images || []);
    setImageUrlInput('');
    setFormIsFeatured(!!product.is_featured);
    setFormIsTrending(!!product.is_trending);
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingProduct) {
      // Auto-generate English/Bengali friendly slug
      const slugCandidate = val
        .toLowerCase()
        .replace(/[^\w\s\u0980-\u09FF-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setFormSlug(slugCandidate || `item-${Date.now()}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const file = files[0];
    const res = await uploadProductImage(file);
    if (res.success && res.url) {
      setFormImages((prev) => [...prev, res.url!]);
    } else {
      alert('ইমেজ আপলোড ব্যর্থ হয়েছে: ' + (res.error || 'Unknown error'));
    }
    setUploadingImage(false);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrice || !formSlug.trim()) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে পণ্যের নাম, স্লাগ এবং মূল্য পূরণ করুন।' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      title: formTitle.trim(),
      slug: formSlug.trim(),
      description: formDescription.trim(),
      price: parseFloat(formPrice),
      compare_at_price: formComparePrice ? parseFloat(formComparePrice) : null,
      stock: parseInt(formStock, 10) || 0,
      category_id: formCategoryId || null,
      images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'],
      is_featured: formIsFeatured,
      is_trending: formIsTrending,
    };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload);
      if (res.success) {
        setFeedback({ type: 'success', message: 'পণ্যটি সফলভাবে আপডেট হয়েছে।' });
        await fetchData();
        setTimeout(() => setIsModalOpen(false), 1000);
      } else {
        setFeedback({ type: 'error', message: res.error || 'পণ্য আপডেট করতে সমস্যা হয়েছে।' });
      }
    } else {
      const res = await createProduct(payload);
      if (res.success) {
        setFeedback({ type: 'success', message: 'নতুন পণ্য সফলভাবে যুক্ত হয়েছে।' });
        await fetchData();
        setTimeout(() => setIsModalOpen(false), 1000);
      } else {
        setFeedback({ type: 'error', message: res.error || 'পণ্য তৈরি করতে সমস্যা হয়েছে।' });
      }
    }

    setSubmitting(false);
  };

  const handleDelete = async (productId: string, title: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${title}" পণ্যটি মুছে ফেলতে চান?`)) {
      return;
    }

    const res = await deleteProduct(productId);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      alert('পণ্য মুছে ফেলা যায়নি: ' + (res.error || 'ত্রুটি'));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category_id === selectedCategory ||
      p.category?.id === selectedCategory ||
      p.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#8d4c2d]" />
            <span>পণ্য ম্যানেজমেন্ট (Products)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            নতুন পণ্য যোগ করুন, ছবি আপলোড করুন, স্টক ও মূল্য পরিচালনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম বা স্লাগ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#8d4c2d] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-stone-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#8d4c2d]"
          >
            <option value="all">সকল ক্যাটাগরি ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-400 animate-pulse">
            পণ্য তালিকা লোড হচ্ছে...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Package className="w-12 h-12 text-stone-300 mx-auto" />
            <div className="text-sm font-bold text-stone-700">কোনো পণ্য পাওয়া যায়নি</div>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              নতুন পণ্য যোগ করতে উপরের &ldquo;নতুন পণ্য যোগ করুন&rdquo; বাটনে ক্লিক করুন।
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8d4c2d] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>পণ্য তৈরি করুন</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">পণ্য ও ছবি</th>
                  <th className="py-3.5 px-5">ক্যাটাগরি</th>
                  <th className="py-3.5 px-5">বিক্রয় মূল্য</th>
                  <th className="py-3.5 px-5">স্টক</th>
                  <th className="py-3.5 px-5">হাইলাইট / ব্যাজ</th>
                  <th className="py-3.5 px-5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((p) => {
                  const firstImg = p.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 relative flex-shrink-0 border border-stone-200">
                            <Image
                              src={firstImg}
                              alt={p.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 text-xs truncate max-w-xs">
                              {p.title}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5 truncate max-w-[200px]">
                              slug: {p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 align-middle">
                        <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-[11px] font-medium">
                          {p.category?.name || 'সাধারণ'}
                        </span>
                      </td>

                      <td className="py-4 px-5 align-middle">
                        <div className="font-bold text-stone-900 text-sm">৳{p.price}</div>
                        {p.compare_at_price && (
                          <div className="text-[11px] text-stone-400 line-through">
                            ৳{p.compare_at_price}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 align-middle">
                        {p.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            স্টকে আছে ({p.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            স্টক আউট
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {p.is_featured && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded border border-amber-200">
                              ফিচার্ড
                            </span>
                          )}
                          {p.is_trending && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-bold rounded border border-purple-200">
                              ট্রেন্ডিং
                            </span>
                          )}
                          {!p.is_featured && !p.is_trending && (
                            <span className="text-stone-400 text-[11px]">—</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 align-middle text-right space-x-1">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          title="স্টোরফ্রন্টে দেখুন"
                          className="inline-flex p-2 text-stone-500 hover:text-[#8d4c2d] hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(p)}
                          title="এডিট করুন"
                          className="inline-flex p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          title="মুছে ফেলুন"
                          className="inline-flex p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#8d4c2d]/10 text-[#8d4c2d] flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {editingProduct ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যুক্ত করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    পণ্যের নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: প্রিমিয়াম কটন পাঞ্জাবি"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    ইউনিক স্লাগ (Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="premium-cotton-punjabi"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d] font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">ক্যাটাগরি</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d]"
                  >
                    <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d]"
                  />
                </div>
              </div>

              {/* Price & Compare Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    বিক্রয় মূল্য (BDT ৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="1250"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    পূর্বের মূল্য / ডিসকাউন্ট দেখানোর জন্য (ঐচ্ছিক)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1500"
                    value={formComparePrice}
                    onChange={(e) => setFormComparePrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">পণ্যের বিস্তারিত বিবরণ</label>
                <textarea
                  rows={3}
                  placeholder="পণ্যের উপাদান, মাপ ও বৈশিষ্ট্য লিখুন..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d] resize-none"
                />
              </div>

              {/* Image Upload & Management */}
              <div className="space-y-2">
                <label className="block text-stone-700 font-bold">পণ্যের ছবি (Supabase Storage বা URL)</label>

                <div className="flex flex-wrap gap-2 items-center">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl border border-stone-200 transition-colors">
                    <Upload className="w-4 h-4 text-[#8d4c2d]" />
                    <span>{uploadingImage ? 'আপলোড হচ্ছে...' : 'ডিভাইস থেকে ছবি আপলোড করুন'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-stone-400">বা</span>

                  <div className="flex-1 flex gap-2 min-w-[200px]">
                    <input
                      type="url"
                      placeholder="ছবির ওয়েব লিঙ্ক (URL) দিন"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-stone-800 text-white rounded-xl font-bold text-xs"
                    >
                      যুক্ত করুন
                    </button>
                  </div>
                </div>

                {/* Images Preview List */}
                {formImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {formImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-300 group bg-stone-100"
                      >
                        <Image src={img} alt="preview" fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-[#8d4c2d] focus:ring-[#8d4c2d] w-4 h-4"
                  />
                  <span className="font-semibold text-stone-800">ফিচার্ড পণ্য (Home Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsTrending}
                    onChange={(e) => setFormIsTrending(e.target.checked)}
                    className="rounded text-[#8d4c2d] focus:ring-[#8d4c2d] w-4 h-4"
                  />
                  <span className="font-semibold text-stone-800">ট্রেন্ডিং কালেকশন</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-6 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? 'সংরক্ষণ করা হচ্ছে...'
                    : editingProduct
                    ? 'পরিবর্তন সংরক্ষণ করুন'
                    : 'পণ্য তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
