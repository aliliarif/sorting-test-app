export interface Variant {
  name: string;
  stock: number;
  pageView: number;
  conversionRate?: number;
  refundRate?: number;
}

export interface AccumulatedData extends VariantTotal {
  price: number;
  sortingScore?: number;
}

export interface VariantTotal {
  stock?: number;
  pageView?: number;
  conversionRate?: number;
  refundRate?: number;
}

export interface Product {
  name: string;
  price: number;
  variants?: Variant[] | null;
}

export interface ProductResponse extends Product {
  accumulatedProductData?: AccumulatedData;
}
