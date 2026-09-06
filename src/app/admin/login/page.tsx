'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { authenticateAdmin } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authenticateAdmin(usernameOrPhone, password);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'ইউজারনেম অথবা পাসওয়ার্ড ভুল হয়েছে।');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo size="lg" variant="dark" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 border border-stone-700 rounded-full text-xs font-semibold text-[#ce9764]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>অ্যাডমিন প্যানেল সিকিউর লগইন</span>
          </div>
          <h1 className="text-xl font-bold text-white pt-2">
            অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন
          </h1>
          <p className="text-xs text-stone-400">
            অর্ডার নিয়ন্ত্রণ ও ইউজার ম্যানেজমেন্ট পরিচালনা করতে লগইন করুন।
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              ইউজারনেম অথবা মোবাইল নম্বর
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={usernameOrPhone}
                onChange={(e) => setUsernameOrPhone(e.target.value)}
                placeholder="যেমন: admin অথবা 01883360440"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-800/80 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#ce9764] focus:ring-1 focus:ring-[#ce9764]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-800/80 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#ce9764] focus:ring-1 focus:ring-[#ce9764]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#8d4c2d] hover:bg-[#a05633] text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
