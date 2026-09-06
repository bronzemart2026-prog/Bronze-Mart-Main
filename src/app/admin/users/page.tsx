'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  Lock,
  User,
} from 'lucide-react';
import {
  getAdminUsersList,
  addAdminUser,
  deleteAdminUser,
  AdminUser,
} from '@/lib/admin-auth';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});

  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    const list = await getAdminUsersList();
    setUsers(list);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    if (!newUsername.trim() || !newPhone.trim() || !newPassword.trim()) {
      setFormError('অনুগ্রহ করে ইউজারনেম, ফোন নম্বর এবং পাসওয়ার্ড পূরণ করুন।');
      setFormLoading(false);
      return;
    }

    const res = await addAdminUser({
      username: newUsername,
      phone: newPhone,
      password: newPassword,
    });

    if (res.success) {
      setFormSuccess('নতুন ইউজার সফলভাবে যোগ করা হয়েছে!');
      setNewUsername('');
      setNewPhone('');
      setNewPassword('');
      await loadUsers();
      setTimeout(() => {
        setShowAddModal(false);
        setFormSuccess('');
      }, 1000);
    } else {
      setFormError(res.error || 'ইউজার যোগ করতে ব্যর্থ হয়েছে।');
    }
    setFormLoading(false);
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে ইউজার "${username}" মুছে ফেলতে চান?`)) {
      const res = await deleteAdminUser(id);
      if (res.success) {
        await loadUsers();
      } else {
        alert(res.error || 'ইউজার মুছে ফেলা সম্ভব হয়নি।');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8d4c2d]">
            <ShieldCheck className="w-4 h-4" />
            <span>অ্যাডমিন ম্যানেজমেন্ট</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mt-1">
            ইউজার ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            অ্যাডমিন প্যানেলে লগইন ও ব্যবস্থাপনার জন্য ইউজারদের ইউজারনেম, ফোন নম্বর এবং পাসওয়ার্ড নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন ইউজার যোগ করুন</span>
        </button>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-stone-700" />
            <h2 className="text-sm font-bold text-stone-900">মোট অ্যাডমিন ইউজার ({users.length})</h2>
          </div>
          <span className="text-[11px] text-stone-500">
            ফিল্ডসমূহ: ইউজারনেম • ফোন নম্বর • পাসওয়ার্ড
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400 animate-pulse">
            ইউজার তালিকা লোড হচ্ছে...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            কোনো ইউজার পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">ইউজারনেম</th>
                  <th className="py-3.5 px-5">ফোন নম্বর</th>
                  <th className="py-3.5 px-5">পাসওয়ার্ড</th>
                  <th className="py-3.5 px-5">রোল</th>
                  <th className="py-3.5 px-5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => {
                  const isPassVisible = visiblePasswords[u.id] || false;
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-800">
                            {u.username[0]?.toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900">{u.username}</span>
                            <div className="text-[10px] text-stone-400 font-mono">
                              ID: {u.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-stone-800 font-medium">
                        {u.phone}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-stone-100 px-2.5 py-1 rounded-lg text-stone-600 border border-stone-200 text-xs">
                            •••••••• (সুরক্ষিত/Hashed)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                          {u.role || 'admin'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#fbf7f0] border border-[#ebd8bd] text-[#8d4c2d] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    নতুন অ্যাডমিন ইউজার যোগ করুন
                  </h3>
                  <p className="text-[11px] text-stone-500">ইউজারনেম, ফোন ও পাসওয়ার্ড দিন</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  ইউজারনেম (Username) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="যেমন: manager বা employee1"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  ফোন নম্বর (Phone) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="যেমন: 01883360440"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  পাসওয়ার্ড (Password) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#8d4c2d] focus:bg-white font-mono"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 px-4 bg-[#8d4c2d] hover:bg-[#743e2a] text-white text-xs font-bold rounded-xl transition-colors shadow-xs disabled:opacity-50"
                >
                  {formLoading ? 'সেভ হচ্ছে...' : 'ইউজার সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
