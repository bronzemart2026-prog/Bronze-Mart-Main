'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Phone,
  MapPin,
  RefreshCw,
  ExternalLink,
  Users,
} from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder } from '@/lib/api';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই অর্ডারটি মুছে ফেলতে চান?')) return;
    const res = await deleteOrder(orderId);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      alert('অর্ডার মুছতে সমস্যা হয়েছে: ' + (res.error || 'ত্রুটি'));
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#8d4c2d]" />
            <span>অ্যাডমিন ড্যাশবোর্ড ও অর্ডারসমূহ</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            কাস্টমার অর্ডার পরিচালনা, প্রোডাক্ট ও ক্যাটাগরি কনফিগারেশন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>+ পণ্য ম্যানেজমেন্ট</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
          >
            <span>ক্যাটাগরি</span>
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>ইউজার</span>
          </Link>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">সর্বমোট অর্ডার</span>
            <ShoppingBag className="w-5 h-5 text-[#8d4c2d]" />
          </div>
          <div className="text-2xl font-bold text-stone-900">{orders.length} টি</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">অপেক্ষমান অর্ডার (Pending)</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount} টি</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">ডেলিভারড সম্পন্ন</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{deliveredCount} টি</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">মোট সেলস রেভিনিউ</span>
            <span className="font-bold text-xs text-[#8d4c2d]">BDT</span>
          </div>
          <div className="text-2xl font-bold text-stone-900">৳{totalRevenue.toFixed(0)}</div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">সাম্প্রতিক কাস্টমার অর্ডারসমূহ</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              কাস্টমার ডিটেইলস ও অর্ডারের স্ট্যাটাস পরিবর্তন করুন
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#8d4c2d] text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              সকল ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              পেন্ডিং ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'delivered'
                  ? 'bg-emerald-700 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ডেলিভারড ({deliveredCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-stone-400 animate-pulse">
            অর্ডার তালিকা লোড হচ্ছে...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs text-stone-500">
            এই মুহূর্তে কোনো অর্ডার পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">অর্ডার নম্বর / সময়</th>
                  <th className="py-3.5 px-5">গ্রাহকের নাম ও ফোন</th>
                  <th className="py-3.5 px-5">ডেলিভারি ঠিকানা</th>
                  <th className="py-3.5 px-5">পণ্য তালিকা</th>
                  <th className="py-3.5 px-5">মোট বিল ও পেমেন্ট</th>
                  <th className="py-3.5 px-5">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const addr = order.shipping_address || {};
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-5 align-top">
                        <div className="font-mono font-bold text-stone-900 text-xs">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-5 align-top">
                        <div className="font-bold text-stone-900">{order.customer_name}</div>
                        {order.customer_phone && (
                          <div className="flex items-center gap-1 text-stone-600 font-mono mt-1 text-[11px]">
                            <Phone className="w-3 h-3 text-[#8d4c2d]" />
                            <a href={`tel:${order.customer_phone}`} className="hover:underline">
                              {order.customer_phone}
                            </a>
                          </div>
                        )}
                        {order.customer_email && (
                          <div className="text-[10px] text-stone-400 truncate max-w-[150px]">
                            {order.customer_email}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 align-top max-w-xs">
                        <div className="text-stone-700 leading-relaxed">
                          {addr.street || 'ঠিকানা দেওয়া হয়নি'}
                        </div>
                        <div className="text-[11px] text-stone-500 font-semibold mt-0.5">
                          {addr.city || 'ঢাকা'} {addr.state ? `, ${addr.state}` : ''}
                        </div>
                        {order.notes && (
                          <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-md mt-1.5 border border-amber-200">
                            নোট: {order.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 align-top">
                        {order.order_items && order.order_items.length > 0 ? (
                          <div className="space-y-1 max-w-[200px]">
                            {order.order_items.map((item: any, idx: number) => (
                              <div key={idx} className="text-[11px] text-stone-800 flex justify-between gap-2">
                                <span className="truncate">{item.title}</span>
                                <span className="font-bold text-stone-500 flex-shrink-0">
                                  ×{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">আইটেম তথ্য নেই</span>
                        )}
                      </td>

                      <td className="py-4 px-5 align-top">
                        <div className="font-bold text-stone-900 text-sm">
                          ৳{Number(order.total_amount).toFixed(0)}
                        </div>
                        <div className="text-[10px] uppercase font-semibold text-stone-500 mt-0.5">
                          {order.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : order.payment_method}
                        </div>
                      </td>

                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : order.status === 'processing'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : order.status === 'cancelled'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="pending">পেন্ডিং (Pending)</option>
                            <option value="processing">প্রসেসিং (Processing)</option>
                            <option value="delivered">ডেলিভারড (Delivered)</option>
                            <option value="cancelled">বাতিল (Cancelled)</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            title="অর্ডার মুছুন"
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
