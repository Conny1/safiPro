// src/types/order.ts
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type OrderStatus = 'pending' | 'processing' | 'washing' | 'drying' | 'ironing' | 'ready' | 'completed' | 'delivered' | 'cancelled';
export type DeliveryMethod = 'pickup' | 'delivery';
export type ServiceType = 'Wash Only' | 'Dry Cleaning' | 'Ironing' | 'Wash & Fold' | 'Full Service' | 'Wash & Iron';
export type PaymentMethod = 'cash' | 'mpesa' | 'card';

export interface Order {
  _id: string;
  order_no?: string;
  branch_id: string;
  name: string;
  email?: string | null;
  phone_number: string;
  delivery_method: DeliveryMethod;
  items_description: string;
  service_type: ServiceType;
  address?: string;
  pickup_date: string;
  order_date?: string;
  amount: number;
  currency?: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  status: OrderStatus;
  is_completed: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  sync_status?: 'synced' | 'pending' | 'failed';
  last_sync_at?: string;
}

export interface OrderFilter {
  branch_id?: string;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  search?: string;
  limit?: number;
  skip?: number;
}