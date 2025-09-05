import { Pagination } from "./common.type";

export enum IsPaid {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  CANCELLED = "CANCELLED",
}

export enum UpdateIsPaid {
  SUCCESS = "SUCCESS",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  TRANSFER = "TRANSFER",
}

export interface CheckoutCustomer {
  username: string;
  email: string;
  profile_image: string | File | null;
}

export interface Billing {
  payment_method?: PaymentMethod;
  sub_total: number;
  tax: number;
  delivery_fee: number;
  total_amount: number;
}

export interface Shipping {
  address: string;
  city: string;
  post_code: string;
  phone_number: string;
}

export interface Transaction_Detail {
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    product_image: string | File | null;
  };
}

export interface Transaction {
  id: string;
  is_paid: IsPaid;
  proof: string | File | null;
  notes: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  totalItemPurchase: number;
  transaction_detail: Transaction_Detail[];
  customer: CheckoutCustomer;
  billing: Billing;
  shipping: Shipping;
}

export interface IGetTransaction {
  transactions: Transaction[];
  meta: Pagination;
}

export interface ICheckout extends Shipping {
  payment_method: PaymentMethod;
  notes: string | null;
}
