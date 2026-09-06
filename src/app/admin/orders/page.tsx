'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  Trash2,
  Printer,
  X,
  FileText,
  User,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder } from '@/lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    }
    setUpdatingId(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই অর্ডারটি সম্পূর্ণ মুছে ফেলতে চান?')) return;
    const res = await deleteOrder(orderId);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } else {
      alert('অর্ডার মুছতে ব্যর্থ হয়েছে: ' + (res.error || 'ত্রুটি'));
    }
  };

  const filteredOrders = orders.filter((o) => {
    const addr = o.shipping_address || {};
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone?.includes(searchQuery) ||
      addr.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.street?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#8d4c2d]" />
            <span>কাস্টমার অর্ডার ম্যানেজমেন্ট</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ইনকামিং সব অর্ডারের বিবরণ দেখুন, স্ট্যাটাস আপডেট ও ইনভয়েস প্রিন্ট করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Filter Stats Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">সকল অর্ডার</div>
          <div className="text-xl font-bold mt-1">{totalCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">অপেক্ষমান (Pending)</div>
          <div className="text-xl font-bold mt-1 text-amber-600 group-[.bg-amber-600]:text-white">
            {pendingCount}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('processing')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'processing'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-blue-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">প্রসেসিং</div>
          <div className="text-xl font-bold mt-1">{processingCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('shipped')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'shipped'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-indigo-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">ডেলিভারিতে (Shipped)</div>
          <div className="text-xl font-bold mt-1">{shippedCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('delivered')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'delivered'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">ডেলিভারড সম্পন্ন</div>
          <div className="text-xl font-bold mt-1">{deliveredCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'cancelled'
              ? 'bg-red-600 text-white border-red-600 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-red-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">বাতিল (Cancelled)</div>
          <div className="text-xl font-bold mt-1">{cancelledCount}</div>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="অর্ডার নং, নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#8d4c2d] transition-all"
          />
        </div>
        <div className="text-xs text-stone-500 font-semibold hidden sm:block">
          ফিল্টারকৃত ফলাফল: {filteredOrders.length} টি
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-400 animate-pulse">
            অর্ডার তালিকা লোড হচ্ছে...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
            <div className="text-sm font-bold text-stone-700">কোনো অর্ডার পাওয়া যায়নি</div>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              কাস্টমাররা স্টোর থেকে অর্ডার প্লেস করলে এখানে স্বয়ংক্রিয়ভাবে দৃশ্যমান হবে।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">অর্ডার কোড / তারিখ</th>
                  <th className="py-3.5 px-5">গ্রাহকের নাম ও মোবাইল</th>
                  <th className="py-3.5 px-5">ডেলিভারি ঠিকানা</th>
                  <th className="py-3.5 px-5">আইটেম সংখ্যা</th>
                  <th className="py-3.5 px-5">মোট বিল</th>
                  <th className="py-3.5 px-5">স্ট্যাটাস</th>
                  <th className="py-3.5 px-5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const addr = order.shipping_address || {};
                  const itemCount = order.order_items?.reduce(
                    (sum: number, it: any) => sum + (it.quantity || 1),
                    0
                  ) || (order.order_items?.length || 0);

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
                      </td>

                      <td className="py-4 px-5 align-top max-w-xs">
                        <div className="text-stone-700 leading-relaxed truncate max-w-[200px]">
                          {addr.street || 'ঠিকানা দেওয়া হয়নি'}
                        </div>
                        <div className="text-[11px] text-stone-500 font-semibold mt-0.5">
                          {addr.city || 'ঢাকা'}
                        </div>
                      </td>

                      <td className="py-4 px-5 align-top">
                        <span className="inline-block px-2 py-0.5 bg-stone-100 rounded-md font-bold text-stone-700 text-[11px]">
                          {itemCount} টি পণ্য
                        </span>
                      </td>

                      <td className="py-4 px-5 align-top">
                        <div className="font-bold text-stone-900 text-sm">
                          ৳{Number(order.total_amount).toFixed(0)}
                        </div>
                        <div className="text-[10px] text-stone-500 uppercase font-semibold">
                          {order.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : order.payment_method}
                        </div>
                      </td>

                      <td className="py-4 px-5 align-top">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'processing'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : order.status === 'shipped'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                              : order.status === 'cancelled'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">পেন্ডিং (Pending)</option>
                          <option value="processing">প্রসেসিং (Processing)</option>
                          <option value="shipped">ডেলিভারিতে (Shipped)</option>
                          <option value="delivered">ডেলিভারড (Delivered)</option>
                          <option value="cancelled">বাতিল (Cancelled)</option>
                        </select>
                      </td>

                      <td className="py-4 px-5 align-top text-right space-x-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="বিস্তারিত দেখুন"
                          className="inline-flex p-2 text-stone-600 hover:text-[#8d4c2d] hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          title="অর্ডার মুছুন"
                          className="inline-flex p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#8d4c2d]/10 text-[#8d4c2d] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    অর্ডার রসিদ / বিবরণ #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <div className="text-[11px] text-stone-400">
                    তারিখ:{' '}
                    {new Date(selectedOrder.created_at).toLocaleString('bn-BD', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                  title="প্রিন্ট করুন"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="mt-5 space-y-6 text-xs">
              {/* Customer & Address Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#8d4c2d]" />
                    <span>গ্রাহকের তথ্য</span>
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{selectedOrder.customer_name}</div>
                  {selectedOrder.customer_phone && (
                    <div className="mt-1 font-mono text-stone-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#8d4c2d]" />
                      <a href={`tel:${selectedOrder.customer_phone}`} className="hover:underline font-bold">
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                  )}
                  {selectedOrder.customer_email && (
                    <div className="mt-1 text-stone-500 text-[11px]">{selectedOrder.customer_email}</div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8d4c2d]" />
                    <span>ডেলিভারি ঠিকানা</span>
                  </div>
                  <div className="text-stone-800 leading-relaxed">
                    {selectedOrder.shipping_address?.street || 'ঠিকানা উল্লেখ নেই'}
                  </div>
                  <div className="text-stone-600 font-semibold mt-1">
                    {selectedOrder.shipping_address?.city || 'ঢাকা'}
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-2 text-[11px] text-amber-900 bg-amber-100/60 p-2 rounded-xl border border-amber-200">
                      <strong>গ্রাহকের নোট:</strong> {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <div className="font-bold text-stone-900 mb-2">অর্ডারকৃত পণ্যসমূহ:</div>
                <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
                  {selectedOrder.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 relative flex-shrink-0 border border-stone-200">
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-400 flex items-center justify-center font-bold text-xs">
                            BM
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-stone-900">{item.title}</div>
                          <div className="text-[11px] text-stone-400">
                            একক মূল্য: ৳{item.price} × {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="font-bold text-stone-900 text-sm">
                        ৳{(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill & Status Footer */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-stone-500">পেমেন্ট মাধ্যম:</div>
                  <div className="font-bold text-stone-900 capitalize">
                    {selectedOrder.payment_method === 'cod'
                      ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)'
                      : selectedOrder.payment_method}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] text-stone-500">সর্বমোট প্রদেয়:</div>
                    <div className="text-xl font-bold text-[#8d4c2d]">
                      ৳{Number(selectedOrder.total_amount).toFixed(0)}
                    </div>
                  </div>

                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="text-xs font-bold rounded-xl px-3 py-2 border border-stone-300 bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="pending">পেন্ডিং (Pending)</option>
                    <option value="processing">প্রসেসিং (Processing)</option>
                    <option value="shipped">ডেলিভারিতে (Shipped)</option>
                    <option value="delivered">ডেলিভারড (Delivered)</option>
                    <option value="cancelled">বাতিল (Cancelled)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>অর্ডার মুছুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
