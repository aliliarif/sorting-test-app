export interface SortingFormula {
  operator: string; // 'first' | 'add' | 'mul' | 'div' | 'sub';
  name: string;
}

// fields eligible for field variant calculation
export enum CalculableFields {
  stock,
  pageView,
  conversionRate,
  refundRate,
}

export enum Operators {
  first = '',
  add = '+',
  sub = '-',
  mul = '*',
  div = '/',
}
