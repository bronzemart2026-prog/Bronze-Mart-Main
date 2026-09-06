'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        if (data.session) {
          router.push('/account');
          router.refresh();
        } else {
          setSuccessMsg(
            'একাউন্ট সফলভাবে তৈরি হয়েছে! আপনার ইমেইল চেক করুন।'
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'একটি সমস্যা দেখা দিয়েছে।');
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
            নতুন একাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs text-stone-500">
            ব্রোঞ্জ মার্টে যুক্ত হয়ে সহজে কেনাকাটা করুন।
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              আপনার পূর্ণ নাম
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="যেমন: মোঃ করিম হাসান"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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
              পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
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
            <span>{loading ? 'একাউন্ট তৈরি হচ্ছে...' : 'একাউন্ট রেজিস্টার করুন'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          ইতিমধ্যে একাউন্ট আছে?{' '}
          <Link href="/auth/login" className="text-[#8d4c2d] font-bold hover:underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
