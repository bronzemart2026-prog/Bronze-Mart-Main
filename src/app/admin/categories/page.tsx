'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Search,
} from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const fetchCategoriesList = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const slugCandidate = val
        .toLowerCase()
        .replace(/[^\w\s\u0980-\u09FF-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setFormSlug(slugCandidate || `cat-${Date.now()}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      setFeedback({ type: 'error', message: 'ক্যাটাগরির নাম এবং স্লাগ আবশ্যক।' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      name: formName.trim(),
      slug: formSlug.trim(),
      description: formDescription.trim(),
    };

    if (editingCategory) {
      const res = await updateCategory(editingCategory.id, payload);
      if (res.success) {
        setFeedback({ type: 'success', message: 'ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে।' });
        await fetchCategoriesList();
        setTimeout(() => setIsModalOpen(false), 1000);
      } else {
        setFeedback({ type: 'error', message: res.error || 'ক্যাটাগরি আপডেট ব্যর্থ হয়েছে।' });
      }
    } else {
      const res = await createCategory(payload);
      if (res.success) {
        setFeedback({ type: 'success', message: 'নতুন ক্যাটাগরি তৈরি হয়েছে।' });
        await fetchCategoriesList();
        setTimeout(() => setIsModalOpen(false), 1000);
      } else {
        setFeedback({ type: 'error', message: res.error || 'ক্যাটাগরি তৈরি ব্যর্থ হয়েছে।' });
      }
    }

    setSubmitting(false);
  };

  const handleDelete = async (categoryId: string, name: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${name}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
      return;
    }

    const res = await deleteCategory(categoryId);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } else {
      alert('ক্যাটাগরি মোছা যায়নি: ' + (res.error || 'ত্রুটি'));
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#8d4c2d]" />
            <span>ক্যাটাগরি ম্যানেজমেন্ট</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ওয়েবসাইটের সকল পণ্য ক্যাটাগরি যুক্ত, সম্পাদন ও পরিচালনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategoriesList}
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
            <span>নতুন ক্যাটাগরি</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ক্যাটাগরির নাম বা স্লাগ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#8d4c2d] transition-all"
          />
        </div>
        <div className="text-xs text-stone-500 font-semibold hidden sm:block">
          মোট ক্যাটাগরি: {categories.length} টি
        </div>
      </div>

      {/* Categories Grid / List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-400 animate-pulse">
            ক্যাটাগরি তালিকা লোড হচ্ছে...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
            <div className="text-sm font-bold text-stone-700">কোনো ক্যাটাগরি পাওয়া যায়নি</div>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Supabase SQL স্ক্রিপ্ট রান করলে বা নতুন ক্যাটাগরি তৈরি করলে এখানে দৃশ্যমান হবে।
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8d4c2d] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ক্যাটাগরি তৈরি করুন</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">ক্যাটাগরির নাম</th>
                  <th className="py-3.5 px-5">স্লাগ (URL Slug)</th>
                  <th className="py-3.5 px-5">বিবরণ</th>
                  <th className="py-3.5 px-5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-5 align-middle">
                      <div className="font-bold text-stone-900 text-xs flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#8d4c2d]/10 text-[#8d4c2d] flex items-center justify-center font-bold">
                          {c.name[0]}
                        </div>
                        <span>{c.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 align-middle font-mono text-[11px] text-stone-600">
                      <span className="px-2 py-1 bg-stone-100 rounded-md">/{c.slug}</span>
                    </td>

                    <td className="py-4 px-5 align-middle text-stone-600 max-w-md">
                      {c.description || '—'}
                    </td>

                    <td className="py-4 px-5 align-middle text-right space-x-1">
                      <button
                        onClick={() => openEditModal(c)}
                        title="এডিট করুন"
                        className="inline-flex p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        title="মুছে ফেলুন"
                        className="inline-flex p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#8d4c2d]/10 text-[#8d4c2d] flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {editingCategory ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি তৈরি'}
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
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  ক্যাটাগরির নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: জুতো ও ব্যাগ"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
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
                  placeholder="footwear-bags"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  rows={3}
                  placeholder="ক্যাটাগরির সংক্ষিপ্ত বিবরণ লিখুন..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#8d4c2d] resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? 'সংরক্ষণ হচ্ছে...'
                    : editingCategory
                    ? 'সংরক্ষণ করুন'
                    : 'তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
