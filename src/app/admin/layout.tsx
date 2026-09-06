'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Users,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Package,
  Layers,
} from 'lucide-react';
import Logo from '@/components/common/Logo';
import { getAdminSession, clearAdminSession, AdminUser } from '@/lib/admin-auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // If on login page, don't enforce layout checks
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const currentSession = getAdminSession();
    if (!currentSession) {
      router.push('/admin/login');
    } else {
      setAdmin(currentSession);
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white text-xs">
        অ্যাডমিন প্যানেল লোড হচ্ছে...
      </div>
    );
  }

  const navItems = [
    {
      name: 'ড্যাশবোর্ড ওভারভিউ',
      href: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname === '/admin',
    },
    {
      name: 'অর্ডার ম্যানেজমেন্ট',
      href: '/admin/orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      active: pathname === '/admin/orders',
    },
    {
      name: 'পণ্য ম্যানেজমেন্ট (Products)',
      href: '/admin/products',
      icon: <Package className="w-4 h-4" />,
      active: pathname.startsWith('/admin/products'),
    },
    {
      name: 'ক্যাটাগরি ম্যানেজমেন্ট',
      href: '/admin/categories',
      icon: <Layers className="w-4 h-4" />,
      active: pathname.startsWith('/admin/categories'),
    },
    {
      name: 'ইউজার ম্যানেজমেন্ট',
      href: '/admin/users',
      icon: <Users className="w-4 h-4" />,
      active: pathname === '/admin/users',
    },
    {
      name: 'ওয়েবসাইট ভিজিট করুন',
      href: '/',
      target: '_blank',
      icon: <ExternalLink className="w-4 h-4" />,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
        <Logo size="sm" variant="dark" />
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-lg bg-stone-800 text-white"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-stone-900 text-stone-200 border-r border-stone-800 flex flex-col justify-between p-5 flex-shrink-0 ${
          mobileNavOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          <div className="hidden md:block pb-4 border-b border-stone-800">
            <Logo size="md" variant="dark" />
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#ce9764] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-stone-500 px-3 pb-2">
              নেভিগেশন মেনু
            </div>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.target}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  item.active
                    ? 'bg-[#8d4c2d] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.target === '_blank' && <ExternalLink className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            ))}
          </div>
        </div>

        {/* Admin User Footer */}
        <div className="pt-6 mt-6 border-t border-stone-800 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-[#8d4c2d] text-white flex items-center justify-center font-bold text-xs">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{admin?.username || 'অ্যাডমিন'}</div>
              <div className="text-[10px] text-stone-400 truncate">{admin?.phone}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-800 hover:bg-red-950/40 hover:text-red-400 text-stone-400 text-xs font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
