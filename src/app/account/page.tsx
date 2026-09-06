'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Package,
  LogOut,
  ArrowRight,
  Calendar,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);

      // Fetch user's orders
      const { data: orderData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setOrders(orderData || []);
      setLoading(false);
    }

    loadAccount();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="text-xs font-semibold text-stone-500 animate-pulse">
          একাউন্ট লোড হচ্ছে...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              ইউজার ড্যাশবোর্ড
            </span>
            <h1 className="text-3xl font-bold text-stone-900 mt-1">
              আমার একাউন্ট ও অর্ডার হিস্ট্রি
            </h1>
          </div>

          <button
            onClick={handleSignOut}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-red-600 bg-white border border-stone-200 rounded-xl transition-colors shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Profile Information Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 font-bold text-base">
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {user.user_metadata?.full_name || 'সম্মানিত গ্রাহক'}
                  </h3>
                  <p className="text-xs text-stone-500 truncate max-w-[200px]">{user.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>একাউন্ট স্ট্যাটাস</span>
                  <span className="font-semibold text-emerald-700">সক্রিয় (Active)</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>ইউজার আইডি</span>
                  <span className="font-mono text-[11px] text-stone-400 truncate max-w-[120px]">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order History */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  মোট অর্ডারসমূহ ({orders.length})
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
                    <Package className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 mb-1">এখনো কোনো অর্ডার করেননি</h4>
                  <p className="text-xs text-stone-400 mb-6 max-w-xs mx-auto">
                    আমাদের সেরা কালেকশন দেখুন এবং আপনার পছন্দের পণ্য অর্ডার করুন।
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <span>পণ্য দেখুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-stone-900">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                            {order.status === 'pending' ? 'অপেক্ষমান' : order.status === 'delivered' ? 'ডেলিভারড' : order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.created_at).toLocaleDateString('bn-BD')}
                          </span>
                          <span>•</span>
                          <span>পেমেন্ট: {order.payment_method.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
                        <span className="text-xs text-stone-500">মোট বিল</span>
                        <span className="text-sm font-bold text-stone-900">
                          ৳{Number(order.total_amount).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
