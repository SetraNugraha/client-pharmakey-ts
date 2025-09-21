import { Pagination } from "./common.type";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  image_public_id: string;
}

export interface IGetCateogry {
  categories: Category[];
  meta: Pagination;
}

export interface ICreateCategory {
  name: string;
  slug: string;
  category_image: string | File | null;
}

export interface IUpdateCategory {
  name?: string;
  slug: string;
  category_image?: string | File | null;
}
