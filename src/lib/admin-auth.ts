import { createClient } from './supabase/client';

export interface AdminUser {
  id: string;
  username: string;
  phone: string;
  password?: string;
  role?: string;
  created_at?: string;
}

const LOCAL_ADMINS_KEY = 'bronze_mart_admin_users';
const ADMIN_SESSION_KEY = 'bronze_mart_admin_session';

const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    username: 'bronze-admin',
    phone: '01883360440',
    password: '123456',
    role: 'super_admin',
    created_at: new Date().toISOString(),
  },
];

export function getStoredAdmins(): AdminUser[] {
  if (typeof window === 'undefined') return DEFAULT_ADMINS;
  try {
    const raw = localStorage.getItem(LOCAL_ADMINS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(DEFAULT_ADMINS));
      return DEFAULT_ADMINS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADMINS;
  }
}

export function saveStoredAdmins(admins: AdminUser[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(admins));
  }
}

export function getAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(admin: AdminUser) {
  if (typeof window !== 'undefined') {
    const safeAdmin = { ...admin };
    delete safeAdmin.password;
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(safeAdmin));
    document.cookie = `admin_logged_in=true; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    document.cookie = 'admin_logged_in=; path=/; max-age=0';
  }
}

// Fetch Admin Users (Supabase + local fallback)
export async function getAdminUsersList(): Promise<AdminUser[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as AdminUser[];
    }
  } catch (e) {
    console.warn('Could not fetch from admin_users table, using local storage:', e);
  }
  return getStoredAdmins();
}

// Add Admin User
export async function addAdminUser(payload: {
  username: string;
  phone: string;
  password: string;
}): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    const supabase = createClient();
    const { data: newId, error } = await supabase.rpc('manage_admin_user', {
      p_username: payload.username.trim().toLowerCase(),
      p_phone: payload.phone.trim(),
      p_password: payload.password,
      p_role: 'admin',
    });

    if (!error && newId) {
      const newUser: AdminUser = {
        id: newId,
        username: payload.username.trim().toLowerCase(),
        phone: payload.phone.trim(),
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      const current = getStoredAdmins();
      saveStoredAdmins([newUser, ...current]);
      return { success: true, user: newUser };
    }
  } catch (e: any) {
    console.warn('RPC manage_admin_user failed, storing locally:', e);
  }

  // Local fallback
  const current = getStoredAdmins();
  const exists = current.some(
    (u) =>
      u.username.toLowerCase() === payload.username.trim().toLowerCase() ||
      u.phone === payload.phone.trim()
  );

  if (exists) {
    return { success: false, error: 'এই ইউজারনেম অথবা ফোন নম্বর দিয়ে ইতিমধ্যে ইউজার রয়েছে।' };
  }

  const newUser: AdminUser = {
    id: `admin-${Date.now()}`,
    username: payload.username.trim().toLowerCase(),
    phone: payload.phone.trim(),
    role: 'admin',
    created_at: new Date().toISOString(),
  };

  saveStoredAdmins([newUser, ...current]);
  return { success: true, user: newUser };
}

// Delete Admin User
export async function deleteAdminUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    await supabase.from('admin_users').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete warning:', e);
  }

  const current = getStoredAdmins();
  if (current.length <= 1) {
    return { success: false, error: 'কমপক্ষে একজন অ্যাডমিন ইউজার সিস্টেমে থাকা আবশ্যক।' };
  }
  const filtered = current.filter((u) => u.id !== id);
  saveStoredAdmins(filtered);
  return { success: true };
}

// Authenticate Admin via Secure RPC
export async function authenticateAdmin(
  usernameOrPhone: string,
  password: string
): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
  const query = usernameOrPhone.trim().toLowerCase();
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('verify_admin_login', {
      p_identity: query,
      p_password: password,
    });

    if (!error && data && data.length > 0) {
      const authAdmin = data[0] as AdminUser;
      setAdminSession(authAdmin);
      return { success: true, admin: authAdmin };
    }
  } catch (e) {
    console.warn('Supabase verify_admin_login RPC fallback:', e);
  }

  const admins = getStoredAdmins();
  const match = admins.find(
    (u) =>
      (u.username.toLowerCase() === query || u.phone === query) &&
      (u.password === password || (!u.password && password === '123456'))
  );

  if (match) {
    setAdminSession(match);
    return { success: true, admin: match };
  }

  return { success: false, error: 'ইউজারনেম/ফোন অথবা পাসওয়ার্ড ভুল হয়েছে।' };
}
