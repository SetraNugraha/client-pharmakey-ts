import { Pagination } from "./common.type";

export interface ICreateProduct {
  category_id: string;
  name: string;
  slug: string;
  price: number;
  product_image: string | File | null;
  description: string | null;
}

export interface Product extends ICreateProduct {
  id: string;
}

export interface ProductBySlug {
  id: string
  category_id: string;
  name: string;
  slug: string;
  price: number;
  product_image: string | File | null;
  description: string | null;
  category: {
    name: string;
    category_image: string | null;
  };
}

export interface IGetProduct {
  products: Product[];
  meta: Pagination;
}

export interface IUpdateProduct extends Product {}
