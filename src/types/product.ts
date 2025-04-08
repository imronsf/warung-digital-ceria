
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export type ProductFormValues = {
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
};
