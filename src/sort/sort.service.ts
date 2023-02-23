import { Injectable } from '@nestjs/common';

@Injectable()
export class SortService {
  sortProducts(products, sortingFormula) {
    // TODO: dear candidate, please implement this method
  }

  private formulaForVariantField(fieldName) {
    switch (fieldName) {
      case 'stock':
        return 'arithmetic-sum';
      case 'pageView':
        return 'arithmetic-mean';
      case 'conversionRate':
        return 'arithmetic-mean';
      case 'refundRate':
        return 'arithmetic-mean';
      default:
        return 'arithmetic-mean';
    }
  }
}
