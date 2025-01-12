export interface Product {
  id: number;
  name: string;
  price: number;
  parcelamento: [number, number];
  color: string;
  image: string;
  size: string[];
  date: string;
}

export interface Filters {
  color: string[];
  size: string[];
  minPrice: number;
  maxPrice: number;
}
