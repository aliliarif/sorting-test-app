import { Injectable } from '@nestjs/common';
import {
  Product,
  AccumulatedData,
  ProductResponse,
  Variant,
  SortingFormula,
  Operators,
  CalculableFields,
  VariantTotal,
} from './types';
@Injectable()
export class SortService {
  /**
   *
   * @param products Products (and their variants) to be sorted.
   * @param sortingFormula Sorting formula which the sorting algorithm needs to follow
   * @returns Sorted products and accumulated data per product
   */
  sortProducts(products: Product[], sortingFormula: SortingFormula[]): ProductResponse[] {
    let productsResponse = [] as ProductResponse[];

    for (const product of products) {
      let productResponse: ProductResponse;

      // * Calculate accumulated data
      const accumulatedProductData: AccumulatedData = {
        price: product.price,
        ...this.calculateVariantFieldTotals(product.variants),
      };

      // * Calculate sorting score of the product
      accumulatedProductData.sortingScore = this.calculateSortingScore(
        sortingFormula,
        accumulatedProductData
      );

      // * Form the response object
      productResponse = { ...product, accumulatedProductData };
      productsResponse.push(productResponse);
    }

    return productsResponse.sort(
      (a, b) => b.accumulatedProductData.sortingScore - a.accumulatedProductData.sortingScore
    );
  }

  /**
   * Calculates totals of variant fields that are eligible for calculation
   * Uses formulaForVariantField() to determine the algorithm of calculation
   * @param variants Product Variants
   * @returns Totals of variant fields eligible for calculation
   */
  private calculateVariantFieldTotals(variants: Variant[]): VariantTotal {
    const sumVariantTotals: VariantTotal = {};

    for (const variant of variants) {
      const variantsCount = variants.length;
      Object.keys(variant).forEach((variantFieldName) => {
        if (Object.values(CalculableFields).includes(variantFieldName)) {
          if (!sumVariantTotals?.[variantFieldName]) sumVariantTotals[variantFieldName] = 0;
          sumVariantTotals[variantFieldName] +=
            this.formulaForVariantField(variantFieldName) === 'arithmetic-mean'
              ? variant[variantFieldName] / variantsCount
              : variant[variantFieldName];
        }
      });
    }

    return sumVariantTotals;
  }

  /**
   * Sorting score is calculated based on sortingFormula passed as parameter
   * Formula is based on operator (as Operators enum) and operand which is translated to variant field value
   * With one exception, `fixedValue:X` is passed as operand
   * @param sortingFormula
   * @param accumulatedProductData
   * @returns Calculated Score for given Product
   */
  private calculateSortingScore(
    sortingFormula: SortingFormula[],
    accumulatedProductData: AccumulatedData
  ): number {
    let sumScore = '';
    for (const formula of sortingFormula) {
      const operator = Operators[formula.operator];
      const operand =
        formula.name.split(':')[0] === 'fixedValue'
          ? formula.name.split(':')[1]
          : accumulatedProductData[formula.name];
      sumScore += `${operator} ${operand}`;
    }

    // safe to use "eval" here because both operators and operand are assumed to be "safe" variables
    // eval follows PEMDAS by default
    // otherwise, if eval got to be switched for another solution, calculator service should be created which will follow PEMDAS
    return eval(sumScore);
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
