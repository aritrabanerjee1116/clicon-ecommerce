// ===== Shared TypeScript Types for E-Commerce Platform =====

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  addresses: Address[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  price_in_rupees: number;
  category_id: number | null;
  stock_quantity: number;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  details: Record<string, string>;
  created_at: string;
  updated_at: string;
  // joined
  category?: Category;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: string | null;
  user_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  // joined
  product?: Product;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  // joined
  product?: Product;
}

export interface WishlistItem {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
  // joined
  product?: Product;
}

export interface Order {
  id: number;
  user_id: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  shipping_address: Address;
  notes: string;
  created_at: string;
  updated_at: string;
  // joined
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_title: string;
  product_image: string;
  price: number;
  quantity: number;
}

export interface SiteSetting {
  key: string;
  value: string;
  updated_at: string;
}
