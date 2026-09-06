import { createClient } from './supabase/client';
import { Category, Product } from './types';

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('⚠️ Supabase tables not initialized yet. Run supabase_schema.sql in your Supabase SQL Editor.');
      } else {
        console.error('Error fetching categories from Supabase:', error.message || error);
      }
      return [];
    }
    return (data as Category[]) || [];
  } catch (err: any) {
    console.error('Error fetching categories:', err.message || err);
    return [];
  }
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  limit?: number;
}): Promise<Product[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('products').select('*, category:categories(*)');

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    if (options?.isFeatured) {
      query = query.eq('is_featured', true);
    }
    if (options?.isTrending) {
      query = query.eq('is_trending', true);
    }
    if (options?.search) {
      query = query.ilike('title', `%${options.search}%`);
    }

    if (options?.sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (options?.sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (options?.sort === 'rating') {
      query = query.order('rating', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('⚠️ Supabase tables not initialized yet. Run supabase_schema.sql in your Supabase SQL Editor.');
      } else {
        console.error('Error fetching products from Supabase:', error.message || error);
      }
      return [];
    }

    let products = (data as Product[]) || [];
    if (options?.categorySlug) {
      products = products.filter((p) => p.category?.slug === options.categorySlug);
    }

    return products;
  } catch (err: any) {
    console.error('Error fetching products:', err.message || err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // 0 rows found
        console.error('Error fetching product by slug:', error.message || error);
      }
      return null;
    }
    return (data as Product) || null;
  } catch (err: any) {
    console.error('Error fetching product by slug:', err.message || err);
    return null;
  }
}

export async function createOrder(orderPayload: {
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
  payment_method: 'cod' | 'card' | 'bkash' | 'stripe';
  notes?: string;
  items: {
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    image_url?: string;
  }[];
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userData?.user?.id || null,
        customer_name: orderPayload.customer_name,
        customer_email: orderPayload.customer_email,
        customer_phone: orderPayload.customer_phone,
        shipping_address: orderPayload.shipping_address,
        total_amount: orderPayload.total_amount,
        payment_method: orderPayload.payment_method,
        status: 'pending',
        payment_status: 'unpaid',
        notes: orderPayload.notes,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Database order insert failed:', orderError.message || orderError);
      return { success: false, error: orderError.message };
    }

    // 2. Insert order items
    if (order && orderPayload.items.length > 0) {
      const orderItems = orderPayload.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        console.error('Database order_items insert failed:', itemsError.message || itemsError);
      }
    }

    return { success: true, orderId: order?.id };
  } catch (err: any) {
    console.error('Order creation error:', err.message || err);
    return { success: false, error: err.message || 'Failed to place order.' };
  }
}

export async function getOrders(): Promise<any[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Orders fetch note:', error.message || error);
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.error('Error fetching orders:', err.message || err);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order status:', error.message || error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Update status error:', err);
    return false;
  }
}

export async function uploadProductImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Image upload failed:', uploadError.message || uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    console.error('Upload product image error:', err.message || err);
    return { success: false, error: err.message || 'Image upload failed.' };
  }
}

// -------------------------------------------------------------
// Admin Product CRUD APIs
// -------------------------------------------------------------

export async function createProduct(productData: {
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  category_id?: string | null;
  images: string[];
  is_featured?: boolean;
  is_trending?: boolean;
  specs?: Record<string, string>;
}): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .insert({
        title: productData.title,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        compare_at_price: productData.compare_at_price || null,
        stock: productData.stock || 0,
        category_id: productData.category_id || null,
        images: productData.images || [],
        is_featured: !!productData.is_featured,
        is_trending: !!productData.is_trending,
        specs: productData.specs || {},
      })
      .select('*, category:categories(*)')
      .single();

    if (error) {
      console.error('Error creating product:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true, product: data as Product };
  } catch (err: any) {
    console.error('Create product error:', err.message || err);
    return { success: false, error: err.message || 'Failed to create product.' };
  }
}

export async function updateProduct(
  productId: string,
  productData: Partial<{
    title: string;
    slug: string;
    description: string;
    price: number;
    compare_at_price: number | null;
    stock: number;
    category_id: string | null;
    images: string[];
    is_featured: boolean;
    is_trending: boolean;
    specs: Record<string, string>;
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId);

    if (error) {
      console.error('Error updating product:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Update product error:', err.message || err);
    return { success: false, error: err.message || 'Failed to update product.' };
  }
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Delete product error:', err.message || err);
    return { success: false, error: err.message || 'Failed to delete product.' };
  }
}

// -------------------------------------------------------------
// Admin Category CRUD APIs
// -------------------------------------------------------------

export async function createCategory(categoryData: {
  name: string;
  slug: string;
  description?: string;
}): Promise<{ success: boolean; category?: Category; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating category:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true, category: data as Category };
  } catch (err: any) {
    console.error('Create category error:', err.message || err);
    return { success: false, error: err.message || 'Failed to create category.' };
  }
}

export async function updateCategory(
  categoryId: string,
  categoryData: { name: string; slug: string; description?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', categoryId);

    if (error) {
      console.error('Error updating category:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Update category error:', err.message || err);
    return { success: false, error: err.message || 'Failed to update category.' };
  }
}

export async function deleteCategory(categoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Delete category error:', err.message || err);
    return { success: false, error: err.message || 'Failed to delete category.' };
  }
}

// -------------------------------------------------------------
// Admin Order Delete API
// -------------------------------------------------------------

export async function deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Delete order error:', err.message || err);
    return { success: false, error: err.message || 'Failed to delete order.' };
  }
}



