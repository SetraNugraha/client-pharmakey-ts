export enum CartActionMethod {
  ADD = "add",
  REMOVE = "remove",
}

interface Product {
  name: string;
  slug: string;
  category_id: string;
  image_url: string;
  price: number;
}

interface Customer {
  username: string;
  email: string;
  image_url: string | null;
}

export interface ICart {
  product_id: string;
  quantity: number;
  product: Product;
}

export interface IGetCartDto extends Customer {
  customer_id: string;
  cart: ICart[];
}
