export type Role = 'admin' | 'manager' | 'staff';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  products_count?: number;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category_id: number;
  category?: Category;
  price: number;
  quantity: number;
  reorder_level: number;
  created_at?: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference?: string;
  notes?: string;
  product?: Product;
  user?: User;
  created_at: string;
}