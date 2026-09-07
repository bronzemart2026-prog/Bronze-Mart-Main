'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Copy,
  Check,
  Phone,
  Truck,
  Flame,
  Crown,
  Zap,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  FileText,
  Share2,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { SITE_NAME, SITE_NAME_BN, SITE_URL, HOTLINE_DISPLAY } from '@/lib/seo';

interface PostGeneratorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

type TemplateType = 'hot_offer' | 'premium' | 'short_viral' | 'cod_trust';

export default function PostGeneratorModal({
  product,
  isOpen,
  onClose,
}: PostGeneratorModalProps) {
  const [template, setTemplate] = useState<TemplateType>('hot_offer');
  const [includeUrl, setIncludeUrl] = useState(true);
  const [includeHotline, setIncludeHotline] = useState(true);
  const [includeDelivery, setIncludeDelivery] = useState(true);
  const [customDiscountText, setCustomDiscountText] = useState('সীমিত সময়ের বিশেষ অফার!');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const firstImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/logo-mark.png';

  const priceFormatted = `৳${product.price}`;
  const comparePriceFormatted = product.compare_at_price
    ? `৳${product.compare_at_price}`
    : null;

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100
        )
      : null;

  // Generate Post Text based on active template (natural human tone, no AI vibes)
  const generatePostContent = (): string => {
    const lines: string[] = [];

    if (template === 'hot_offer') {
      lines.push(`${customDiscountText || 'বিশেষ অফার!'}`);
      lines.push(`${product.title}\n`);
      lines.push(`সেরা কোয়ালিটি এবং নিখুঁত ফিনিশিংয়ের এই পণ্যটি এখন পাচ্ছেন আকর্ষণীয় মূল্যে। সীমিত স্টক রয়েছে, তাই আপনার পছন্দের পণ্যটি আজই অর্ডার করে ফেলুন।\n`);
      
      lines.push(`💰 বর্তমান অফার মূল্য: ${priceFormatted}`);
      if (comparePriceFormatted) {
        lines.push(`🏷️ রেগুলার প্রাইস: ${comparePriceFormatted} ${discountPercent ? `(${discountPercent}% ডিসকাউন্ট)` : ''}`);
      }
      lines.push('');

      if (product.description) {
        const shortDesc = product.description.slice(0, 140);
        lines.push(`📌 পণ্যের বিবরণ: ${shortDesc}${product.description.length > 140 ? '...' : ''}\n`);
      }

      if (includeDelivery) {
        lines.push(`🚚 ডেলিভারি সুবিধা:`);
        lines.push(`• বাঁশখালীতে ১০০০+ টাকার অর্ডারে সম্পূর্ণ ফ্রি হোম ডেলিভারি!`);
        lines.push(`• চট্টগ্রাম সিটিতে হোম ডেলিভারি চার্জ মাত্র ৭০ টাকা`);
        lines.push(`• সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ) 🇧🇩\n`);
      }

      if (includeUrl) {
        lines.push(`👉 ওয়েবসাইটে সরাসরি অর্ডার করতে ক্লিক করুন:`);
        lines.push(`${productUrl}\n`);
      }

      if (includeHotline) {
        lines.push(`📞 অর্ডার ও যেকোনো তথ্যের জন্য কল করুন: ${HOTLINE_DISPLAY}`);
        lines.push(`💬 হোয়াটসঅ্যাপে ইনবক্স করতে: wa.me/8801883360440\n`);
      }

      lines.push(`🛍️ ${SITE_NAME_BN} (${SITE_NAME}) — কোয়ালিটি • ট্রাস্ট • ভ্যালু`);
      lines.push(`#BronzeMart #OnlineShopping #Banshkhali #Chattogram #${product.category?.name ? product.category.name.replace(/\s+/g, '') : 'Shopping'} #HomeDeliveryBD`);

    } else if (template === 'premium') {
      lines.push(`প্রিমিয়াম কালেকশন — ${product.title}\n`);
      lines.push(`আপনার লাইফস্টাইল ও আভিজাত্যকে আরও সুন্দর করতে ${SITE_NAME_BN}-এর বাছাইকৃত কালেকশন। শতভাগ অথেনটিক কোয়ালিটি ও দীর্ঘস্থায়িত্বের নিশ্চয়তা।\n`);
      
      lines.push(`🏷️ মূল্য: ${priceFormatted}`);
      if (comparePriceFormatted) {
        lines.push(`🏷️ পূর্বের মূল্য: ${comparePriceFormatted}`);
      }
      lines.push(`✨ স্টক স্ট্যাটাস: ${product.stock > 0 ? 'রেডি স্টক' : 'লিমিটেড স্টক'}\n`);

      if (product.description) {
        lines.push(`🔍 বিশেষ বৈশিষ্ট্য:`);
        lines.push(`• ${product.description.slice(0, 160)}\n`);
      }

      if (includeDelivery) {
        lines.push(`📦 ডেলিভারি সুবিধা:`);
        lines.push(`• বাঁশখালীর ভেতর ১০০০+ ৳ অর্ডারে ফ্রি ডেলিভারি`);
        lines.push(`• সারা দেশে ক্যাশ অন ডেলিভারি সুবিধা\n`);
      }

      if (includeUrl) {
        lines.push(`🌐 অনলাইনে অর্ডার করার লিঙ্ক:`);
        lines.push(`${productUrl}\n`);
      }

      if (includeHotline) {
        lines.push(`📱 হটলাইন: ${HOTLINE_DISPLAY}`);
        lines.push(`💬 হোয়াটসঅ্যাপ: wa.me/8801883360440\n`);
      }

      lines.push(`🌟 ${SITE_NAME_BN} — আপনার বিশ্বস্ত অনলাইন শপ`);
      lines.push(`#BronzeMart #PremiumCollection #Banshkhali #OnlineShopBD`);

    } else if (template === 'short_viral') {
      lines.push(`${product.title} — এখন সেরা অফারে!\n`);
      lines.push(`মাত্র ${priceFormatted} টাকায় ঘরে বসেই পেয়ে যান সেরা মানের এই পণ্যটি! 🛍️\n`);

      if (comparePriceFormatted) {
        lines.push(`💥 ধামাকা মূল্য: ${comparePriceFormatted}-এর জায়গায় মাত্র ${priceFormatted}`);
      }
      lines.push(`✔️ সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি`);
      lines.push(`✔️ বাঁশখালীতে ফ্রি ডেলিভারি সুবিধা\n`);

      if (includeUrl) {
        lines.push(`🔗 অর্ডার লিঙ্ক: ${productUrl}\n`);
      }

      if (includeHotline) {
        lines.push(`📞 কল বা হোয়াটসঅ্যাপ করুন: ${HOTLINE_DISPLAY}`);
      }
      lines.push(`\n#BronzeMart #QuickOrder #Banshkhali #OnlineShopping`);

    } else if (template === 'cod_trust') {
      lines.push(`পণ্য হাতে পেয়ে দেখে টাকা দিন — শতভাগ নিরাপদ শপিং!\n`);
      lines.push(`আপনার পছন্দের ${product.title} অর্ডার করুন সম্পূর্ণ নিশ্চিন্তে।\n`);
      
      lines.push(`💵 প্রদেয় মূল্য: ${priceFormatted}`);
      if (comparePriceFormatted) {
        lines.push(`📉 বিশেষ ছাড়: ${comparePriceFormatted} থেকে কমে ${priceFormatted}`);
      }
      lines.push('');

      lines.push(`কেন ব্রোঞ্জ মার্ট থেকে নিবেন?`);
      lines.push(`✔️ পণ্য ডেলিভারিম্যান থেকে চেক করে মূল্য পরিশোধের নিশ্চয়তা`);
      lines.push(`✔️ বাঁশখালীর ভেতরে ১০০০+ টাকার অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি`);
      lines.push(`✔️ ১০০% কোয়ালিটি পণ্য`);
      lines.push(`✔️ সহজ রিটার্ন ও বন্ধুত্বপূর্ণ কাস্টমার সাপোর্ট\n`);

      if (includeUrl) {
        lines.push(`🛒 ওয়েবসাইটে সরাসরি অর্ডার করুন:`);
        lines.push(`${productUrl}\n`);
      }

      if (includeHotline) {
        lines.push(`📲 ইনবক্স বা কল করুন: ${HOTLINE_DISPLAY}`);
        lines.push(`💬 হোয়াটসঅ্যাপ: wa.me/8801883360440\n`);
      }
      lines.push(`#BronzeMart #CashOnDeliveryBD #TrustworthyShopping #Banshkhali`);
    }

    return lines.join('\n');
  };

  const postText = generatePostContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      postText
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#1c1917] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8d4c2d] text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4 text-[#ebd8bd]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                সোশ্যাল মিডিয়া পোস্ট ক্যাপশন
              </h3>
              <p className="text-[11px] text-stone-400">
                ফেসবুক পেজ ও হোয়াটসঅ্যাপে শেয়ার বা মেসেজ পাঠানোর জন্য রেডিমেড বাংলা পোস্ট।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Top Product Snapshot Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-xl overflow-hidden bg-white relative flex-shrink-0 border border-stone-300 shadow-2xs">
                <Image
                  src={firstImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700 uppercase">
                  {product.category?.name || 'সাধারণ'}
                </span>
                <h4 className="font-bold text-stone-900 text-sm truncate mt-0.5">
                  {product.title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8d4c2d] mt-0.5">
                  <span>৳{product.price}</span>
                  {product.compare_at_price && (
                    <span className="text-stone-400 line-through text-[11px]">
                      ৳{product.compare_at_price}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-sans">
                      {discountPercent}% ছাড়
                    </span>
                  )}
                </div>
              </div>
            </div>

            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8d4c2d] hover:underline"
            >
              <span>পণ্য পেজ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Template Style Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              ক্যাপশনের ধরণ নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setTemplate('hot_offer')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  template === 'hot_offer'
                    ? 'border-[#8d4c2d] bg-[#8d4c2d]/10 ring-2 ring-[#8d4c2d]/30 text-[#8d4c2d]'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>হট অফার</span>
                </div>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  ডিসকাউন্ট ও অফার মূল্য কেন্দ্রিক।
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('premium')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  template === 'premium'
                    ? 'border-[#8d4c2d] bg-[#8d4c2d]/10 ring-2 ring-[#8d4c2d]/30 text-[#8d4c2d]'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>প্রিমিয়াম ব্র্যান্ড</span>
                </div>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  কোয়ালিটি ও ব্র্যান্ড ভ্যালু কেন্দ্রিক।
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('short_viral')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  template === 'short_viral'
                    ? 'border-[#8d4c2d] bg-[#8d4c2d]/10 ring-2 ring-[#8d4c2d]/30 text-[#8d4c2d]'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>শর্ট ক্যাপশন</span>
                </div>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  সংক্ষিপ্ত ৩-৪ লাইনে দ্রুত বুস্টিং উপযোগী।
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('cod_trust')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  template === 'cod_trust'
                    ? 'border-[#8d4c2d] bg-[#8d4c2d]/10 ring-2 ring-[#8d4c2d]/30 text-[#8d4c2d]'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </div>
                <p className="text-[10px] text-stone-500 line-clamp-2">
                  দেখে টাকা দেওয়ার নিশ্চয়তা।
                </p>
              </button>
            </div>
          </div>

          {/* Customization Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-800 font-semibold">
              <input
                type="checkbox"
                checked={includeUrl}
                onChange={(e) => setIncludeUrl(e.target.checked)}
                className="w-4 h-4 text-[#8d4c2d] rounded focus:ring-[#8d4c2d]"
              />
              <span>ওয়েবসাইট লিঙ্ক</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-stone-800 font-semibold">
              <input
                type="checkbox"
                checked={includeHotline}
                onChange={(e) => setIncludeHotline(e.target.checked)}
                className="w-4 h-4 text-[#8d4c2d] rounded focus:ring-[#8d4c2d]"
              />
              <span>হটলাইন ও হোয়াটসঅ্যাপ</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-stone-800 font-semibold">
              <input
                type="checkbox"
                checked={includeDelivery}
                onChange={(e) => setIncludeDelivery(e.target.checked)}
                className="w-4 h-4 text-[#8d4c2d] rounded focus:ring-[#8d4c2d]"
              />
              <span>বাঁশখালী ফ্রি ডেলিভারি তথ্য</span>
            </label>
          </div>

          {/* Generated Post Box & Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                ক্যাপশন প্রিভিউ:
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {postText.length} অক্ষর
              </span>
            </div>

            <div className="relative">
              <textarea
                value={postText}
                readOnly
                rows={9}
                className="w-full p-4 rounded-2xl bg-stone-900 text-stone-100 font-sans text-xs leading-relaxed border border-stone-700 focus:outline-none resize-none selection:bg-[#8d4c2d]"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions: Copy Button + WhatsApp Share Button */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে পাঠান</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#8d4c2d] hover:bg-[#743e2a] text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>পোস্ট ক্যাপশন কপি করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
