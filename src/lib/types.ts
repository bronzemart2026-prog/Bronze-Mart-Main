export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  rating: number;
  reviews_count: number;
  category_id?: string | null;
  category?: Category | null;
  images: string[];
  is_featured: boolean;
  is_trending: boolean;
  specs?: Record<string, string>;
  created_at?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: {
    street: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'cod' | 'card' | 'bkash' | 'stripe';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface UserProfile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  shipping_address?: Record<string, any>;
}
