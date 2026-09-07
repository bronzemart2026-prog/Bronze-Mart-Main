'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, Phone, Mail, MapPin } from 'lucide-react';
import { SITE_NAME, SITE_NAME_BN } from '@/lib/seo';

interface InvoiceModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  const addr = order.shipping_address || {};
  const orderIdShort = (order.id || '').slice(0, 8).toUpperCase();
  const invoiceNumber = `BM-INV-${orderIdShort}`;

  // 1. Calculate Subtotal from line items if available
  const calculatedItemsSubtotal = order.order_items?.reduce(
    (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );

  const discount = Number(order.discount_amount) || 0;

  // 2. Exact Delivery Charge handling
  const deliveryFee =
    order.delivery_charge !== undefined && order.delivery_charge !== null
      ? Number(order.delivery_charge)
      : calculatedItemsSubtotal !== undefined && Number(order.total_amount) > calculatedItemsSubtotal
      ? Number(order.total_amount) - calculatedItemsSubtotal
      : 0;

  const isDeliveryPaid = !!order.is_delivery_paid;

  // Subtotal fallback guarantee
  const subtotal =
    calculatedItemsSubtotal && calculatedItemsSubtotal > 0
      ? calculatedItemsSubtotal
      : Math.max(0, Number(order.total_amount) - deliveryFee + discount);

  // 3. Gross Total & Net Total
  const grossTotal = subtotal + deliveryFee;
  const netTotal = Math.max(0, grossTotal - discount);

  // 4. Paid & Due Calculations (Strict Mathematical Consistency)
  const paidAmount = Number(order.paid_amount) || 0;
  const dueAmount = Math.max(0, netTotal - paidAmount);

  const isPaid = paidAmount >= netTotal && netTotal > 0;
  const isPartiallyPaid = paidAmount > 0 && paidAmount < netTotal;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:rounded-none print:max-w-none print:m-0 print:w-full">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold bg-[#8d4c2d] text-white px-2.5 py-0.5 rounded tracking-wider uppercase">
              Official Invoice
            </span>
            <span className="text-xs text-stone-300 font-mono font-medium">#{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8d4c2d] hover:bg-[#a05633] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / PDF ডাউনলোড</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div
          className="p-8 sm:p-10 text-stone-900 space-y-6 print:p-6 print:text-black bg-white print:space-y-4"
          id="invoice-printable-area"
          style={{
            fontFamily: "var(--font-hind-siliguri), 'Hind Siliguri', 'Noto Sans Bengali', -apple-system, sans-serif",
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-stone-900">
            {/* Left: Brand & Contacts */}
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex-shrink-0 flex items-center justify-center p-1.5 shadow-2xs">
                <Image
                  src="/logo-mark.png"
                  alt="Bronze Mart Logo"
                  width={64}
                  height={64}
                  priority
                  className="object-contain"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
                    BRONZE MART
                  </h1>
                  <span className="text-xs font-bold text-[#8d4c2d]">
                    ({SITE_NAME_BN})
                  </span>
                </div>

                <div className="pt-1 space-y-1 text-xs text-stone-600">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8d4c2d] flex-shrink-0" />
                    <span>বাঁশখালী ও ঢাকা, বাংলাদেশ</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8d4c2d] flex-shrink-0" />
                    <span>হটলাইন / হোয়াটসঅ্যাপ: ০১৮৮৩-৩৬০৪৪০</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8d4c2d] flex-shrink-0" />
                    <span>ইমেইল: bronzemart2026@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Invoice Meta Card */}
            <div className="sm:text-right space-y-2 self-stretch sm:self-auto bg-stone-50 sm:bg-stone-50/80 p-4 rounded-2xl border border-stone-200 min-w-[240px]">
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="px-3 py-1 bg-stone-900 text-white text-[11px] font-bold rounded-lg tracking-wider uppercase shadow-2xs">
                  ক্যাশ মেমো / INVOICE
                </span>
              </div>

              <div className="text-xs font-bold text-[#8d4c2d]">
                <span className="font-semibold text-stone-700">ইনভয়েস নং: </span>
                <span className="font-bold font-mono">#{invoiceNumber}</span>
              </div>

              <div className="text-xs text-stone-700">
                <span className="text-stone-500">তারিখ: </span>
                <span className="font-semibold text-stone-900">{formattedDate}</span>
              </div>

              <div className="text-xs text-stone-700">
                <span className="text-stone-500">পেমেন্ট মাধ্যম: </span>
                <span className="font-bold text-stone-900 uppercase">
                  {order.payment_method === 'cod'
                    ? 'ক্যাশ অন ডেলিভারি (COD)'
                    : order.payment_method === 'bkash'
                    ? 'বিকাশ / নগদ'
                    : order.payment_method || 'COD'}
                </span>
              </div>

              <div className="pt-1 flex sm:justify-end">
                <span
                  className={`inline-block px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isPartiallyPaid
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-stone-200 text-stone-800 border border-stone-300'
                  }`}
                >
                  {isPaid ? 'পরিশোধিত (PAID)' : isPartiallyPaid ? 'আংশিক পরিশোধ (PARTIAL)' : 'বকেয়া (DUE / COD)'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-stone-300 bg-stone-50/70 space-y-1.5 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-[#8d4c2d] tracking-wider pb-1.5 border-b border-stone-200">
                গ্রাহকের তথ্য (BILL TO):
              </div>
              <p className="font-bold text-sm text-stone-950 pt-0.5">{order.customer_name}</p>
              {order.customer_phone && (
                <p className="text-stone-800 font-bold text-xs">
                  <span className="font-medium text-stone-600">মোবাইল: </span>
                  <span className="font-mono">{order.customer_phone}</span>
                </p>
              )}
              {order.customer_email && (
                <p className="text-stone-600 text-[11px]">{order.customer_email}</p>
              )}
            </div>

            <div className="p-4 rounded-2xl border border-stone-300 bg-stone-50/70 space-y-1.5 shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-[#8d4c2d] tracking-wider pb-1.5 border-b border-stone-200">
                ডেলিভারি ঠিকানা (SHIP TO):
              </div>
              <p className="text-stone-900 font-medium leading-relaxed pt-0.5">
                {addr.street || 'ঠিকানা উল্লেখ নেই'}
              </p>
              <p className="text-stone-700 font-semibold">
                {addr.city ? `${addr.city}, ` : ''}{addr.postal_code || ''} {addr.country || 'বাংলাদেশ'}
              </p>
              {order.notes && (
                <p className="text-[11px] text-amber-900 bg-amber-50/90 px-2.5 py-1 rounded-lg border border-amber-200 mt-1">
                  <strong>নোট:</strong> {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="overflow-hidden border border-stone-400 rounded-2xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-100 text-stone-900 font-bold border-b border-stone-400">
                <tr>
                  <th className="py-3 px-3.5 w-12 text-center border-r border-stone-300">ক্র.নং</th>
                  <th className="py-3 px-4 border-r border-stone-300">পণ্যের নাম ও বিবরণ</th>
                  <th className="py-3 px-3.5 text-center w-20 border-r border-stone-300">পরিমাণ</th>
                  <th className="py-3 px-3.5 text-right w-24 border-r border-stone-300">একক মূল্য</th>
                  <th className="py-3 px-4 text-right w-28">মোট টাকা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-stone-50/60">
                      <td className="py-3 px-3.5 text-center text-stone-600 font-mono border-r border-stone-200">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-950 border-r border-stone-200">
                        {item.title}
                      </td>
                      <td className="py-3 px-3.5 text-center font-bold text-stone-800 font-mono border-r border-stone-200">
                        {item.quantity || 1}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-stone-800 border-r border-stone-200">
                        ৳{Number(item.price || 0).toFixed(0)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-950 font-mono">
                        ৳{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 px-3.5 text-center text-stone-600 font-mono border-r border-stone-200">
                      1
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-950 border-r border-stone-200">
                      অর্ডারকৃত পণ্যসামগ্রী
                    </td>
                    <td className="py-3 px-3.5 text-center font-bold text-stone-800 font-mono border-r border-stone-200">
                      1
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-stone-800 border-r border-stone-200">
                      ৳{subtotal.toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-950 font-mono">
                      ৳{subtotal.toFixed(0)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Ledger Calculation & Terms */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-1">
            {/* Note Area on Left */}
            <div className="flex-1 text-xs space-y-2 text-stone-600">
              <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-xs">বিশেষ নির্দেশিকা:</p>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  এটি ব্রোঞ্জ মার্টের অফিসিয়াল ডিজিটাল ইনভয়েস স্লিপ। পণ্য গ্রহণের সময় পরিমাণ ও ক্যাশ মেমো মিলিয়ে বুঝে নেয়ার জন্য অনুরোধ করা হলো।
                </p>
                <div className="text-[11px] font-semibold text-stone-700 pt-2 border-t border-stone-200 flex items-center gap-1.5">
                  <span>ডেলিভারি চার্জ স্ট্যাটাস:</span>
                  {deliveryFee === 0 ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ফ্রি ডেলিভারি (Free Delivery)
                    </span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDeliveryPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isDeliveryPaid ? 'অগ্রিম পরিশোধ সম্পন্ন (Paid)' : 'পণ্য পাওয়ার পর প্রদেয় (Due on Delivery)'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Ledger on Right */}
            <div className="w-full sm:w-80 space-y-2 text-xs bg-stone-50/90 p-4 sm:p-5 rounded-2xl border border-stone-300 shadow-2xs">
              {/* Subtotal */}
              <div className="flex justify-between text-stone-700">
                <span>পণ্যের মোট মূল্য (Subtotal):</span>
                <span className="font-bold font-mono text-stone-900">৳{subtotal.toFixed(0)}</span>
              </div>

              {/* Delivery Charge (Always accounted for) */}
              <div className="flex justify-between items-center text-stone-700">
                <span className="flex items-center gap-1.5">
                  <span>ডেলিভারি চার্জ:</span>
                  {deliveryFee === 0 ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      ফ্রি
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isDeliveryPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isDeliveryPaid ? 'পেইড' : 'বকেয়া'}
                    </span>
                  )}
                </span>
                <span className="font-mono font-semibold text-stone-900">
                  {deliveryFee === 0 ? '৳০ (ফ্রি)' : `৳${deliveryFee.toFixed(0)}`}
                </span>
              </div>

              {/* Discount (if any) */}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>বিশেষ ছাড় (Discount):</span>
                  <span className="font-mono">-৳{discount.toFixed(0)}</span>
                </div>
              )}

              {/* Net Total Bill */}
              <div className="flex justify-between text-sm font-black text-stone-950 pt-2.5 border-t-2 border-stone-300">
                <span>সর্বমোট প্রদেয় বিল (Total):</span>
                <span className="text-[#8d4c2d] font-mono text-base">৳{netTotal.toFixed(0)}</span>
              </div>

              {/* Paid Amount */}
              <div className="flex justify-between font-bold text-emerald-800 pt-2 border-t border-dashed border-stone-300">
                <span>পরিশোধিত টাকা (Paid):</span>
                <span className="font-mono">৳{paidAmount.toFixed(0)}</span>
              </div>

              {/* Due Amount */}
              <div
                className={`flex justify-between font-bold text-sm pt-1.5 border-t border-stone-400 ${
                  dueAmount > 0 ? 'text-red-700' : 'text-emerald-700'
                }`}
              >
                <span>বকেয়া টাকা (Due):</span>
                <span className="font-mono font-black text-base">
                  {dueAmount > 0 ? `৳${dueAmount.toFixed(0)}` : '৳০ (পরিশোধিত)'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Signature Section */}
          <div className="pt-8 border-t border-stone-300 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-stone-600">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-stone-900 text-xs">
                ব্রোঞ্জ মার্টের সাথে কেনাকাটা করার জন্য আন্তরিক ধন্যবাদ!
              </p>
              <p className="text-[11px] text-stone-500">
                হটলাইন: ০১৮৮৩-৩৬০৪৪০ | ভিজিট করুন: www.bronzemart.com
              </p>
            </div>

            <div className="text-center sm:text-right pt-4 sm:pt-0">
              <div className="w-40 border-b-2 border-stone-800 pb-1 mb-1 font-bold text-stone-900 text-[11px]">
                কর্তৃপক্ষের স্বাক্ষর
              </div>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                Authorized Signature
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
