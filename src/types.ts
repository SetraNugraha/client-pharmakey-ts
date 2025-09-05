

export type Customer = {
  id?: number;
  username: string;
  email: string;
  role?: "CUSTOMER";
  profile_image: string | File | null;
  address: string | null;
  city: string | null;
  post_code: number | null;
  phone_number: string | null;
};

export type Product = {
  id?: number;
  category_id: number;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  product_image: string | File | null;
};

export type Cart = {
  user_id?: number;
  product: Product;
  quantity: number;
};

type PaymentMethod = "TRANSFER" | "COD";
type IsPaid = "PENDING" | "SUCCESS" | "CANCELLED";
type Proof = File | string | null;

export type Transaction = {
  id?: number;
  user_id: number;
  sub_total: number;
  tax: number;
  delivery_fee: number;
  total_amount: number;
  is_paid: IsPaid;
  payment_method: PaymentMethod;
  notes: string | null;
  proof: Proof;
  transaction_detail: TransactionDetail[];

  address: string;
  city: string;
  post_code: number;
  phone_number: string;

  created_at: string;
  updated_at: string;
};

export type TransactionDetail = {
  id?: number;
  transaction_id: number;
  product_id: number;
  price: number;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
};
