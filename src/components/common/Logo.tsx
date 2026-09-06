import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({
  className = '',
  variant = 'light',
  size = 'md',
  showText = true,
}: LogoProps) {
  const iconDimensions = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;

  const isDark = variant === 'dark';

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 flex-shrink-0 group ${className}`}>
      {/* Crisp Circular Brand Icon Mark */}
      <div className="relative flex-shrink-0">
        <Image
          src="/logo-mark.png"
          alt="Bronze Mart Logo"
          width={iconDimensions}
          height={iconDimensions}
          priority
          className="object-contain w-auto transition-transform duration-200 group-hover:scale-105"
          style={{ height: `${iconDimensions}px` }}
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <span className="font-black tracking-tight text-lg sm:text-xl leading-none bg-gradient-to-r from-[#ce9764] via-[#be7b41] to-[#8d4c2d] bg-clip-text text-transparent">
              BRONZE
            </span>
            <span
              className={`font-black tracking-tight text-lg sm:text-xl leading-none ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}
            >
              MART
            </span>
          </div>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            কোয়ালিটি • ট্রাস্ট • ভ্যালু
          </span>
        </div>
      )}
    </Link>
  );
}
