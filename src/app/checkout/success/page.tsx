import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId || 'BM-892410';

  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-stone-50 rounded-3xl border border-stone-200 shadow-sm p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            অর্ডার সফল হয়েছে
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            আপনার অর্ডারের জন্য ধন্যবাদ!
          </h1>
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। খুব শীঘ্রই আমাদের কাস্টমার সাপোর্ট টিম থেকে আপনার সাথে যোগাযোগ করা হবে।
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">অর্ডার নম্বর:</span>
            <span className="font-bold text-stone-900 font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">আনুমানিক ডেলিভারি:</span>
            <span className="font-semibold text-stone-800">২ - ৩ কার্যদিবস</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
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
    </div>
  );
}
