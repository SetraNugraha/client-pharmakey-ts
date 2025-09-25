import { Pagination } from "./common.type";

// GET
export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  image_public_id: string | null;
  description: string | null;
}

// GET
export interface ProductBySlug extends Product {
  category: {
    name: string;
    image_url: string | null;
  };
}

// GET
export interface IGetProduct {
  products: Product[];
  meta: Pagination;
}

// CREATE
export interface ICreateProduct extends Omit<Product, "id" | "image_url" | "image_public_id"> {
  product_image: string | null;
}

// UPDATE
export interface IUpdateProduct extends Omit<Product, "image_url" | "image_public_url"> {
  product_image: string | null;
}
