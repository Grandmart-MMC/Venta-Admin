export interface Product {
  id?: number;
  name: string;
  productCode?: string;
  detail?: string;
  price?: number;
  image?: string;
  category?: {
    id: number;
    name: string;
  };
  quantity: number;
}
