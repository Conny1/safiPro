export type addOrder = {
  order_no?: number;
  name: string;
  email: string;
  phone_number: string;
  delivery_method: "Pickup" | "Customer drop-off";
  items_description: string;
  service_type:
    | "Wash Only"
    | "Dry Cleaning"
    | "Ironing"
    | "Wash & Fold"
    | "Full Service"
    | "Wash & Iron";
  pickup_date: string;
  order_date?: string;
  amount: number;
  payment_status: "pending" | "paid";
  payment_method: "cash" | "M-Pesa" | "card";
  status: "pending" | "in-progress" | "completed";
  is_completed: boolean;
  notes: string;
};

export type Order = {
  order_no: number;
  name: string;
  email: string;
  phone_number: string;
  amount: number;
  payment_status: "pending" | "paid";
  payment_method: "cash" | "M-Pesa" | "card";
  status: "pending" | "in-progress" | "completed";
  order_date: string; // ISO date string e.g. "2025-06-04"
  pickup_date: string; // ISO date string
  service_type:
    | "Wash Only"
    | "Dry Cleaning"
    | "Ironing"
    | "Wash & Fold"
    | "Full Service"
    | "Wash & Iron";
  items_description: string;
  delivery_method: "Pickup" | "Customer drop-off";
  is_completed: boolean;
  notes: string;
};

// types.ts
export type Branch = {
  id: string;
  name: string;
  location: string;
};
