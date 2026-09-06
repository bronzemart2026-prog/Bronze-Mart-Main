'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget() {
  const phoneNumber = '8801883360440';
  const message = encodeURIComponent('আসসালামু আলাইকুম, আমি ব্রোঞ্জ মার্ট থেকে পণ্য সম্পর্কে বিস্তারিত জানতে চাই।');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <aside
      aria-label="হোয়াটসঅ্যাপ কাস্টমার সাপোর্ট"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      {/* Tooltip on hover */}
      <span className="hidden md:block mr-3 bg-stone-900 text-white text-xs font-semibold py-1.5 px-3.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-x-2 group-hover:translate-x-0">
        হোয়াটসঅ্যাপে চ্যাট করুন
      </span>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="হোয়াটসঅ্যাপে যোগাযোগ করুন 01883360440"
      >
        {/* Subtle Ping Animation */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30" />

        {/* WhatsApp Vector Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.53 1.771.82 2.796.821 3.183 0 5.77-2.587 5.77-5.768.001-3.181-2.587-5.765-5.77-5.765zm0-2c4.288 0 7.769 3.48 7.77 7.766 0 4.288-3.482 7.77-7.77 7.77-1.328-.001-2.58-.337-3.687-.936l-4.344 1.139 1.159-4.236c-.663-1.15-1.028-2.464-1.028-3.737 0-4.286 3.482-7.766 7.77-7.766zm3.435 11.082c-.143.404-.716.738-1.024.787-.279.044-.645.078-1.849-.421-1.536-.636-2.528-2.186-2.605-2.288-.077-.103-.623-.83-.623-1.583 0-.753.395-1.124.536-1.27.141-.146.309-.182.412-.182.103 0 .207.001.297.005.096.004.225-.036.35.267.129.313.441 1.077.48 1.156.039.078.065.17.013.273-.052.103-.078.167-.155.257-.078.09-.163.201-.233.27-.078.077-.16.16-.068.318.092.158.409.675.877 1.091.603.537 1.111.704 1.269.782.158.078.25.068.343-.039.093-.107.399-.465.505-.625.107-.16.213-.133.359-.079.146.053.926.437 1.086.516.16.079.267.118.306.185.039.066.039.387-.104.791z" />
        </svg>
      </a>
    </aside>
  );
}
