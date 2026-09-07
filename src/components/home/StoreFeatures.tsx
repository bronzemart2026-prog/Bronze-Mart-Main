import React from 'react';
import { Truck, Headphones, ShieldCheck, RefreshCw } from 'lucide-react';

export default function StoreFeatures() {
  const features = [
    {
      icon: <Truck className="w-5 h-5 text-[#8d4c2d]" />,
      title: 'ফ্রি হোম ডেলিভারি',
      desc: 'বাঁশখালীর ভেতরে ১০০০+ অর্ডারে',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#8d4c2d]" />,
      title: '১০০% নিরাপদ পেমেন্ট',
      desc: 'ক্যাশ অন ডেলিভারি ও বিকাশ',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#8d4c2d]" />,
      title: 'সহজ রিটার্ন সুবিধা',
      desc: '৭ দিনের মধ্যে সহজ রিটার্ন',
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#8d4c2d]" />,
      title: '২৪/৭ কাস্টমার সাপোর্ট',
      desc: 'যেকোনো সময় সহায়তা পান',
    },
  ];

  return (
    <section className="py-8 max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="p-3 sm:p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3 hover:border-[#8d4c2d]/40 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

