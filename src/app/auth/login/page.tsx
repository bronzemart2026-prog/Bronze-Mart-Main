'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg('ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
      } else if (data.user) {
        router.push('/account');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-stone-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            একাউন্টে লগইন করুন
          </h1>
          <p className="text-xs text-stone-500">
            আপনার অর্ডার ট্র্যাক ও হিস্ট্রি দেখতে লগইন করুন।
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              ইমেইল ঠিকানা
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            <span>{loading ? 'লগইন হচ্ছে...' : 'সাইন ইন করুন'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          একাউন্ট নেই?{' '}
          <Link href="/auth/signup" className="text-[#8d4c2d] font-bold hover:underline">
            নতুন একাউন্ট খুলুন
          </Link>
        </div>
      </div>
    </div>
  );
}
