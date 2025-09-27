import { Pagination } from "./common.type";

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface Customer {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role | "CUSTOMER";
  image_url: string | null;
  address: string | null;
  city: string | null;
  post_code: string | null;
  phone_number: string | null;
}

export interface IGetCustomerDto {
  customers: Customer[];
  meta: Pagination;
}

export interface IRegisterCustomer {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUpdateCustomer {
  username?: string;
  email?: string;
  address?: string;
  city?: string;
  post_code?: string;
  phone_number?: string;
  profile_image?: string;
}
