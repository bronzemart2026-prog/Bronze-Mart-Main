import React from 'react';
import { Truck, Headphones, ShieldCheck, RefreshCw } from 'lucide-react';

export default function StoreFeatures() {
  const features = [
    {
      icon: <Truck className="w-6 h-6 text-[#8d4c2d]" />,
      title: 'ফ্রি হোম ডেলিভারি (INSIDE BANSKHALI)',
      desc: '১০০০ টাকার অধিক যেকোনো অর্ডারে বিনামূল্যে হোম ডেলিভারি।',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#8d4c2d]" />,
      title: '১০০% নিরাপদ পেমেন্ট',
      desc: 'ক্যাশ অন ডেলিভারি, বিকাশ ও কার্ডের মাধ্যমে নিরাপদ পেমেন্ট।',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[#8d4c2d]" />,
      title: 'সহজ রিটার্ন সুবিধা',
      desc: 'পছন্দ না হলে ৭ দিনের মধ্যে সহজে রিটার্ন বা এক্সচেঞ্জ করুন।',
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#8d4c2d]" />,
      title: 'সার্বক্ষণিক কাস্টমার সাপোর্ট',
      desc: 'যেকোনো জিজ্ঞাসা বা প্রয়োজনে আমাদের কাস্টমার কেয়ার পাশে আছে।',
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4"
          >
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
