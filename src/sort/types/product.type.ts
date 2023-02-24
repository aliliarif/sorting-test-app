interface Variant {
	name: string;
	stock: number;
	pageView: number;
	conversionRate?: number;
	refundRate?: number;
}

export interface AccumulatedData {
	price: number;
	stock: number;
	pageView: number;
	conversionRate?: number;
	refundRate?: number;
	sortingScore?: number;
}

export interface Product {
	name: string;
	price: number;
	variants?: Variant[] | null;
}

export interface ProductResponse extends Product {
	accumulatedProductData?: AccumulatedData;
}
