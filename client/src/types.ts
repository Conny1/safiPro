export type addOrder = {
  branch_id?: string;
  name: string;
  email: string;
  phone_number: string;
  delivery_method: "pickup" | "delivery";
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
  payment_method: "cash" | "mpesa" ;
  status:"pending"|"processing"|"washing"|"drying"|"ironing"|"ready"| "completed"| "delivered"|"cancelled"
  is_completed: boolean;
  address:string;
  notes: string;
};

export type Order = {
  _id?: string;
  order_no?: string;
  branch_id?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  amount?: number;
  payment_status?: "pending" | "paid";
  payment_method?: "cash" | "mpesa";
  status?:"pending"|"processing"|"washing"|"drying"|"ironing"|"ready"| "completed"| "delivered"|"cancelled"
  order_date?: string; // ISO date string e.g. "2025-06-04"
  pickup_date?: string; // ISO date string
  service_type?:
    | "Wash Only"
    | "Dry Cleaning"
    | "Ironing"
    | "Wash & Fold"
    | "Full Service"
    | "Wash & Iron";
  items_description?: string;
  delivery_method?:  "pickup" | "delivery"
  is_completed?: boolean;
  notes?: string;
  address?:string;
  createdAt?:string
};

// types.ts
export type Branch = {
  _id?: string;
  name?: string;
  location?: string;
  user_id?: string;
};
export type createBranch = {
  user_id: string;
  name: string;
  location: string;
};

export const roles = ["Staff"];
export type Role = (typeof roles)[number];

export type createAccount = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  repeat_password: string;
  role?: Role;
  branches?: {
    branch_id: string;
    role: Role;
  }[];
};

export type login = {
  email: string;
  password: string;
};

export type user = {
  email?: string;
  token?: string;
  _id?: string;
  first_name?: string;
  last_name?: string;
  subscription?: { status: "active" | "inactive" };
  authorization?: Object;
  role?: Role;
  branches?: {
    branch_id: string;
    role: Role;
  }[];
  createdAt?:string;
};

export type updatestaff = {
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  branch_id: string;
};

export type findandfilter = {
  match_values: Object;
  sortBy: string;
  limit: number;
  page: number;
  search: string;
};

export type pagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export const USER_ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  BRANCH_MANAGER: "Branch Manager",
  STAFF: "Staff",
} as const;

export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentState = "active" | "expired" | "cancelled";
export type PaymentMethod = "mpesa" | "card" | "cash" | "bank" ;

export type Payment = {
  _id: string;
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: PaymentState;
  expires_at: string; // ISO string format (can be parsed into Date)
  created_at: string;
};

export type mobilePayments = {
  email: string;
  phone_number: string;
  user_id: string;
  amount: number;
};

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface addExpenseType {
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type ExpenseCategory = 
  | 'supplies' 
  | 'maintenance' 
  | 'rent' 
  | 'utilities' 
  | 'salaries' 
  | 'other';



export interface CategoryInfo {
  id: ExpenseCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export interface PaymentMethodInfo {
  label: string;
  color: string;
}

export interface ExpenseFormData {
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface ExpenseFormErrors {
  description?: string;
  amount?: string;
  date?: string;
}

export interface DateFilter {
  from: string;
  to: string;
}