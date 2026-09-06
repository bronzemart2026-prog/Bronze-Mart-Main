-- ==============================================================================
-- BRONZE MART DATABASE SCHEMA & BANGLA SEED DATA
-- Supabase SQL Editor (https://supabase.com/dashboard/project/pxofyilvrqkwdmainnkd/sql) এ এই স্ক্রিপ্টটি রান করুন
-- ==============================================================================

-- ১. ক্যাটাগরি টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ২. পণ্য (Products) টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    stock INTEGER NOT NULL DEFAULT 20,
    rating NUMERIC(2, 1) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 0,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৩. প্রোফাইল (Profiles) টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৪. অর্ডার ও অর্ডার আইটেম টেবিল তৈরি
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    payment_method TEXT NOT NULL DEFAULT 'cod', -- cod, card, bkash, nagad
    payment_status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid, paid, refunded
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ৫. Schema ও টেবিল পারমিশন প্রদান (Fix permission denied error)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- ৫.১ Row Level Security (RLS) সক্রিয়করণ ও পলিসি
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ৬. সিকিউরিটি পলিসি (CRUD অপারেশন অনুমোদন)
-- পূর্বের সকল পলিসি ক্লিনআপ
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public all categories" ON public.categories;
CREATE POLICY "Allow public all categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public all products" ON public.products;
CREATE POLICY "Allow public all products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public all orders" ON public.orders;
CREATE POLICY "Allow public all orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public all order_items" ON public.order_items;
CREATE POLICY "Allow public all order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ৫. অ্যাডমিন ইউজার টেবিল তৈরি (Secure Admin Users)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access admin_users" ON public.admin_users;

-- সিকিউর অ্যাডমিন অথেন্টিকেশন ফাংশন (RPC)
CREATE OR REPLACE FUNCTION public.verify_admin_login(
    p_identity TEXT,
    p_password TEXT
)
RETURNS TABLE (
    id UUID,
    username TEXT,
    phone TEXT,
    role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT au.id, au.username, au.phone, au.role
    FROM public.admin_users au
    WHERE (LOWER(au.username) = LOWER(p_identity) OR au.phone = p_identity)
      AND (au.password_hash = crypt(p_password, au.password_hash) OR au.password_hash = p_password);
END;
$$;

-- অ্যাডমিন ইউজার যোগ/আপডেট ফাংশন
CREATE OR REPLACE FUNCTION public.manage_admin_user(
    p_username TEXT,
    p_phone TEXT,
    p_password TEXT,
    p_role TEXT DEFAULT 'admin'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.admin_users (username, phone, password_hash, role)
    VALUES (LOWER(p_username), p_phone, crypt(p_password, gen_salt('bf')), p_role)
    ON CONFLICT (username) DO UPDATE 
    SET password_hash = crypt(p_password, gen_salt('bf')), phone = p_phone
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$;

-- ৭. প্রাথমিক সুরক্ষিত অ্যাডমিন ইউজার সিড (bronze-admin / 123456)
SELECT public.manage_admin_user('bronze-admin', '01883360440', '123456', 'super_admin');


-- ৮. ক্যাটাগরি সিড ডাটা (বাংলা)
INSERT INTO public.categories (id, name, slug, description) VALUES
('10000000-0000-0000-0000-000000000001', 'মেয়েদের ফ্যাশন ও পোশাক', 'womens-clothing', 'আধুনিক কুর্তি, সালোয়ার কামিজ, টপস, শাড়ি এবং প্রিমিয়াম কালেকশন।'),
('20000000-0000-0000-0000-000000000002', 'ছেলেদের পোশাক', 'mens-clothing', 'আরামদায়ক ক্যাজুয়াল শার্ট, টি-শার্ট, পোলো এবং প্যান্ট।'),
('30000000-0000-0000-0000-000000000003', 'প্রসাধন ও স্কিনকেয়ার', 'cosmetics-skincare', '১০০% অরিজিনাল ময়েশ্চারাইজার, সিরাম, লিপস্টিক ও রূপচর্চা সামগ্রী।'),
('40000000-0000-0000-0000-000000000004', 'জুতো ও ব্যাগ', 'footwear-bags', 'স্টাইলিশ স্নিকার্স, স্যান্ডেল, লেদার ব্যাগ ও পার্স।'),
('50000000-0000-0000-0000-000000000005', 'গয়না ও ঘড়ি', 'jewelry-accessories', 'আধুনিক নেকলেস, ইয়াররিং, আংটি ও রিস্টওয়াচ।'),
('60000000-0000-0000-0000-000000000006', 'হোম ও লাইফস্টাইল', 'home-lifestyle', 'বেডশিট, হোম ডেকর এবং দৈনন্দিন প্রয়োজনীয় সামগ্রী।')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ৯. ইমেজ আপলোডের জন্য স্টোরেজ বাকেট তৈরি (product-images Bucket)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- স্টোরেজ অ্যাক্সেস ও আপলোড পলিসি
DROP POLICY IF EXISTS "Public Access to product-images" ON storage.objects;
CREATE POLICY "Public Access to product-images" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Upload to product-images" ON storage.objects;
CREATE POLICY "Public Upload to product-images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Update product-images" ON storage.objects;
CREATE POLICY "Public Update product-images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Delete product-images" ON storage.objects;
CREATE POLICY "Public Delete product-images" ON storage.objects 
FOR DELETE USING (bucket_id = 'product-images');


