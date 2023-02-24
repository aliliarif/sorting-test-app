export interface SortingFormula {
	operator: string; // 'first' | 'add' | 'mul' | 'div' | 'sub';
	name: string;
}

export enum Operators {
	first = '',
	add = '+',
	sub = '-',
	mul = '*',
	div = '/',
}
