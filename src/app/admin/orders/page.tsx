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
  Save,
  CreditCard,
  Receipt,
  Edit3,
} from 'lucide-react';
import { getOrders, updateOrderStatus, updateOrderAccounting, deleteOrder } from '@/lib/api';
import InvoiceModal from '@/components/common/InvoiceModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Order Details / Edit Accounting Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  // Invoice Modal
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);

  // Accounting Form State inside Modal
  const [editDeliveryCharge, setEditDeliveryCharge] = useState<number>(0);
  const [editIsDeliveryPaid, setEditIsDeliveryPaid] = useState<boolean>(false);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editPaid, setEditPaid] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>('pending');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isSavingAccounting, setIsSavingAccounting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const itemsSubtotal =
        selectedOrder.order_items?.reduce(
          (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
          0
        ) || 0;

      const initialDelivery =
        selectedOrder.delivery_charge !== undefined && selectedOrder.delivery_charge !== null
          ? Number(selectedOrder.delivery_charge)
          : itemsSubtotal > 0 && Number(selectedOrder.total_amount) > itemsSubtotal
          ? Number(selectedOrder.total_amount) - itemsSubtotal
          : 0;

      setEditDeliveryCharge(initialDelivery);
      setEditIsDeliveryPaid(!!selectedOrder.is_delivery_paid);
      setEditDiscount(Number(selectedOrder.discount_amount) || 0);
      setEditPaid(Number(selectedOrder.paid_amount) || 0);
      setEditStatus(selectedOrder.status || 'pending');
      setEditNotes(selectedOrder.notes || '');
    }
  }, [selectedOrder]);

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

  const handleSaveAccounting = async () => {
    if (!selectedOrder) return;
    setIsSavingAccounting(true);

    const itemsSubtotal =
      selectedOrder.order_items?.reduce(
        (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
        0
      ) ||
      Number(selectedOrder.total_amount) ||
      0;

    const delivery = Number(editDeliveryCharge) || 0;
    const discount = Number(editDiscount) || 0;
    const paid = Number(editPaid) || 0;
    const calculatedTotal = itemsSubtotal + delivery;
    const netTotal = Math.max(0, calculatedTotal - discount);
    const due = Math.max(0, netTotal - paid);

    let paymentStatus = 'unpaid';
    if (paid >= netTotal && netTotal > 0) {
      paymentStatus = 'paid';
    } else if (paid > 0 && paid < netTotal) {
      paymentStatus = 'partially_paid';
    }

    const payload = {
      total_amount: calculatedTotal,
      delivery_charge: delivery,
      is_delivery_paid: editIsDeliveryPaid,
      discount_amount: discount,
      paid_amount: paid,
      due_amount: due,
      status: editStatus,
      payment_status: paymentStatus,
      notes: editNotes,
    };

    const res = await updateOrderAccounting(selectedOrder.id, payload);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, ...payload } : o
        )
      );
      setSelectedOrder((prev: any) => ({ ...prev, ...payload }));
      alert('অর্ডারের হিসাব, ডেলিভারি ও স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!');
    } else {
      alert('আপডেট ব্যর্থ হয়েছে: ' + (res.error || 'ত্রুটি'));
    }
    setIsSavingAccounting(false);
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

  // Stats Calculations
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.total_amount) - (Number(o.discount_amount) || 0)),
    0
  );
  const totalPaidCollected = orders.reduce((sum, o) => sum + (Number(o.paid_amount) || 0), 0);
  const totalDuePending = orders.reduce((sum, o) => {
    if (o.status === 'cancelled') return sum;
    const net = Number(o.total_amount) - (Number(o.discount_amount) || 0);
    const paid = Number(o.paid_amount) || 0;
    return sum + Math.max(0, net - paid);
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#8d4c2d]" />
            <span>কাস্টমার অর্ডার ও হিসাব ব্যবস্থাপনা</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ইনকামিং সব অর্ডারের বিবরণ, ডেলিভারি চার্জ, পরিশোধ ও বকেয়া হিসাব এডিট এবং প্রফেশনাল ইনভয়েস PDF তৈরি করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-500 font-semibold">মোট সেলস / রেভিনিউ</div>
            <div className="text-2xl font-black text-stone-900 mt-1 font-mono">
              ৳{totalRevenue.toFixed(0)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#8d4c2d] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-700 font-semibold">মোট আদায়কৃত টাকা (Paid)</div>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
              ৳{totalPaidCollected.toFixed(0)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-red-600 font-semibold">মোট বকেয়া পাওনা (Due)</div>
            <div className="text-2xl font-black text-red-600 mt-1 font-mono">
              ৳{totalDuePending.toFixed(0)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Stats Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
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
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">পেন্ডিং (Pending)</div>
          <div className="text-xl font-bold mt-1">{pendingCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('processing')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
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
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
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
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'delivered'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] opacity-70 font-semibold">ডেলিভারড</div>
          <div className="text-xl font-bold mt-1">{deliveredCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
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

      {/* Orders Table with Accounting & Delivery Columns */}
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
                  <th className="py-3.5 px-4">অর্ডার কোড / তারিখ</th>
                  <th className="py-3.5 px-4">গ্রাহকের নাম ও ফোন</th>
                  <th className="py-3.5 px-4">মোট বিল</th>
                  <th className="py-3.5 px-4">ডেলিভারি চার্জ</th>
                  <th className="py-3.5 px-4">ছাড় (Discount)</th>
                  <th className="py-3.5 px-4">পরিশোধ (Paid)</th>
                  <th className="py-3.5 px-4">বকেয়া (Due)</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const itemsSubtotal =
                    order.order_items?.reduce(
                      (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
                      0
                    );
                  const delivery = Number(order.delivery_charge) || 0;
                  const total =
                    itemsSubtotal !== undefined && itemsSubtotal > 0
                      ? itemsSubtotal + delivery
                      : Number(order.total_amount) || 0;

                  const discount = Number(order.discount_amount) || 0;
                  const paid = Number(order.paid_amount) || 0;
                  const net = Math.max(0, total - discount);
                  const due = Math.max(0, net - paid);

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-4 align-middle">
                        <div className="font-mono font-bold text-stone-900 text-xs">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-middle">
                        <div className="font-bold text-stone-900">{order.customer_name}</div>
                        {order.customer_phone && (
                          <div className="flex items-center gap-1 text-stone-600 font-mono mt-0.5 text-[11px]">
                            <Phone className="w-3 h-3 text-[#8d4c2d]" />
                            <a href={`tel:${order.customer_phone}`} className="hover:underline">
                              {order.customer_phone}
                            </a>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 align-middle">
                        <div className="font-bold text-stone-900 text-sm font-mono">
                          ৳{total.toFixed(0)}
                        </div>
                        <div className="text-[10px] text-stone-500 uppercase font-semibold">
                          {order.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : order.payment_method}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-middle">
                        <div className="font-mono font-bold text-stone-800">
                          {delivery > 0 ? `৳${delivery.toFixed(0)}` : 'ফ্রি'}
                        </div>
                        {delivery > 0 && (
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                              order.is_delivery_paid
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.is_delivery_paid ? 'অগ্রিম পেইড' : 'বকেয়া'}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 align-middle font-mono">
                        {discount > 0 ? (
                          <span className="text-emerald-700 font-bold">-৳{discount.toFixed(0)}</span>
                        ) : (
                          <span className="text-stone-400">৳০</span>
                        )}
                      </td>

                      <td className="py-4 px-4 align-middle font-mono">
                        <span className="font-bold text-emerald-700">৳{paid.toFixed(0)}</span>
                      </td>

                      <td className="py-4 px-4 align-middle font-mono">
                        <span className={`font-bold ${due > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                          ৳{due.toFixed(0)}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-middle">
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

                      <td className="py-4 px-4 align-middle text-right space-x-1">
                        {/* Invoice Button */}
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          title="ইনভয়েস PDF / প্রিন্ট"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#8d4c2d]/10 hover:bg-[#8d4c2d] text-[#8d4c2d] hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>ইনভয়েস</span>
                        </button>

                        {/* View & Edit Details */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="হিসাব ও স্ট্যাটাস এডিট করুন"
                          className="inline-flex items-center gap-1 p-1.5 text-stone-600 hover:text-[#8d4c2d] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Order */}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          title="অর্ডার মুছুন"
                          className="inline-flex p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Comprehensive Order & Accounting Edit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#8d4c2d]/10 text-[#8d4c2d] flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    অর্ডার ও হিসাব এডিটর #{selectedOrder.id.slice(0, 8).toUpperCase()}
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
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  title="ইনভয়েস PDF প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>ইনভয়েস PDF</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="mt-5 space-y-5 text-xs">
              {/* Customer & Address Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5 flex items-center gap-1">
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
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8d4c2d]" />
                    <span>ডেলিভারি ঠিকানা</span>
                  </div>
                  <div className="text-stone-800 leading-relaxed">
                    {selectedOrder.shipping_address?.street || 'ঠিকানা উল্লেখ নেই'}
                  </div>
                  <div className="text-stone-600 font-semibold mt-1">
                    {selectedOrder.shipping_address?.city || 'ঢাকা'}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <div className="font-bold text-stone-900 mb-2">অর্ডারকৃত পণ্যসমূহ:</div>
                <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
                  {selectedOrder.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4">
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
                          <div className="text-[11px] text-stone-400 font-mono">
                            একক মূল্য: ৳{item.price} × {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="font-bold text-stone-900 text-sm font-mono">
                        ৳{(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Accounting & Delivery Charge Editor */}
              {(() => {
                const itemsSubtotal =
                  selectedOrder.order_items?.reduce(
                    (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
                    0
                  ) || 0;

                const liveTotal = itemsSubtotal + Number(editDeliveryCharge || 0);
                const liveNetTotal = Math.max(0, liveTotal - Number(editDiscount || 0));
                const liveDue = Math.max(0, liveNetTotal - Number(editPaid || 0));

                return (
                  <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-300 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-[#8d4c2d]" />
                        <span>পেমেন্ট, ডেলিভারি ও বকেয়া হিসাব এডিট</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#8d4c2d] bg-stone-200/70 px-2.5 py-0.5 rounded-lg">
                        মোট বিল: ৳{liveTotal.toFixed(0)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Delivery Charge Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          ডেলিভারি চার্জ (Delivery Charge ৳)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editDeliveryCharge}
                          onChange={(e) => setEditDeliveryCharge(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-[#8d4c2d]"
                        />
                      </div>

                      {/* Delivery Paid Toggle */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          ডেলিভারি চার্জ পেমেন্ট স্ট্যাটাস
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                            <input
                              type="checkbox"
                              checked={editIsDeliveryPaid}
                              onChange={(e) => setEditIsDeliveryPaid(e.target.checked)}
                              className="w-4 h-4 rounded text-[#8d4c2d] focus:ring-[#8d4c2d]"
                            />
                            <span>অগ্রিম পরিশোধিত (Paid Advance)</span>
                          </label>
                        </div>
                      </div>

                      {/* Discount Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          বিশেষ ছাড় / ডিসকাউন্ট (Discount ৳)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editDiscount}
                          onChange={(e) => setEditDiscount(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold text-emerald-800 focus:outline-none focus:border-[#8d4c2d]"
                        />
                      </div>

                      {/* Paid Amount Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          মোট পরিশোধিত টাকা (Paid Amount ৳)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editPaid}
                          onChange={(e) => setEditPaid(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-[#8d4c2d]"
                        />
                      </div>
                    </div>

                    {/* Auto-Calculated Summary Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200">
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <div className="text-[10px] text-stone-500 font-semibold">নেট প্রদেয় বিল</div>
                        <div className="text-sm font-bold text-stone-900 font-mono mt-0.5">
                          ৳{liveNetTotal.toFixed(0)}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <div className="text-[10px] text-emerald-700 font-semibold">পরিশোধিত</div>
                        <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5">
                          ৳{Number(editPaid).toFixed(0)}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <div className="text-[10px] text-red-600 font-semibold">অবশিষ্ট বকেয়া (Due)</div>
                        <div className={`text-sm font-black font-mono mt-0.5 ${
                          liveDue > 0 ? 'text-red-600' : 'text-emerald-700'
                        }`}>
                          ৳{liveDue.toFixed(0)}
                        </div>
                      </div>
                    </div>

                    {/* Order Status & Note Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          অর্ডার স্ট্যাটাস (Order Status)
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#8d4c2d] cursor-pointer"
                        >
                          <option value="pending">পেন্ডিং (Pending)</option>
                          <option value="processing">প্রসেসিং (Processing)</option>
                          <option value="shipped">ডেলিভারিতে (Shipped)</option>
                          <option value="delivered">ডেলিভারড (Delivered)</option>
                          <option value="cancelled">বাতিল (Cancelled)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          অর্ডার নোট / মন্তব্য (Optional Notes)
                        </label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="যেমন: বিকাশে ১০০ টাকা অগ্রিম পেয়েছি"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8d4c2d]"
                        />
                      </div>
                    </div>

                    {/* Save Accounting Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveAccounting}
                        disabled={isSavingAccounting}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingAccounting ? 'সংরক্ষণ হচ্ছে...' : 'হিসাব ও স্ট্যাটাস সংরক্ষণ করুন'}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Modal Footer Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-3.5 py-2 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>অর্ডার মুছুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Printable Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
