'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Printer, FileText, ShoppingBag, Truck } from 'lucide-react';
import { getOrderById } from '@/lib/api';
import InvoiceModal from '@/components/common/InvoiceModal';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function loadOrder() {
      try {
        const data = await getOrderById(orderId);
        if (data) {
          setOrder(data);
        }
      } catch (err) {
        console.error('Error fetching order on success page:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  const orderIdDisplay = orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : '#BM-SUCCESS';

  return (
    <div className="bg-stone-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-8 text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-8 h-8 stroke-[2.5]" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            অর্ডার সফল হয়েছে • ORDER CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            আপনার অর্ডারের জন্য আন্তরিক ধন্যবাদ!
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। ডেলিভারি নিশ্চিত করতে খুব শীঘ্রই আমাদের কাস্টমার সাপোর্ট টিম আপনার সাথে যোগাযোগ করবে।
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500 font-medium">অর্ডার রেফারেন্স নম্বর:</span>
            <span className="font-bold text-stone-900 font-mono text-sm bg-stone-200/70 px-2 py-0.5 rounded-md">
              {orderIdDisplay}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">গ্রাহকের নাম:</span>
            <span className="font-semibold text-stone-800">
              {order?.customer_name || 'সম্মানিত ক্রেতা'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">পেমেন্ট মেথড:</span>
            <span className="font-semibold text-stone-800 uppercase font-mono">
              {order?.payment_method === 'cod' ? 'ক্যাশ অন ডেলিভারি (COD)' : order?.payment_method || 'COD'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">সর্বমোট প্রদেয় বিল:</span>
            <span className="font-bold text-[#8d4c2d] text-sm font-mono">
              ৳{Number(order?.total_amount || 0).toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-stone-200">
            <span className="text-stone-500">আনুমানিক ডেলিভারি সময়:</span>
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#8d4c2d]" />
              <span>২ - ৩ কার্যদিবস</span>
            </span>
          </div>
        </div>

        {/* Invoice Download Action */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">ক্যাশ মেমো / ইনভয়েস স্লিপ</h4>
              <p className="text-[11px] text-stone-500">অর্ডারের রসিদ দেখুন অথবা পিডিএফ হিসেবে ডাউনলোড ও প্রিন্ট করুন</p>
            </div>
          </div>

          <button
            onClick={() => setShowInvoiceModal(true)}
            disabled={!order}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>ইনভয়েস PDF দেখুন</span>
          </button>
        </div>

        {/* Navigation Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>আরও কেনাকাটা করুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
          >
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>
      </div>

      {/* Invoice Modal */}
      {order && (
        <InvoiceModal
          order={order}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center bg-stone-50">
          <div className="text-xs font-bold text-stone-500 animate-pulse">
            অর্ডারের তথ্য লোড হচ্ছে...
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
