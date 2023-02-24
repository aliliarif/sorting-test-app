import { Injectable } from '@nestjs/common';
import { Product, AccumulatedData, ProductResponse, SortingFormula, Operators } from './types';
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
			// This calculation is done assuming that variant fields are not dynamic
			// formulaForVariantField() is used to determine field calculation method
			const accumulatedProductData: AccumulatedData = {
				price: product.price,
				...product.variants.reduce(
					(acc, item) => {
						const variantsCount = product.variants.length;
						acc.stock +=
							this.formulaForVariantField('stock') === 'arithmetic-mean'
								? item.stock / variantsCount
								: item.stock;
						acc.pageView +=
							this.formulaForVariantField('pageView') === 'arithmetic-mean'
								? item.pageView / variantsCount
								: item.pageView;
						acc.conversionRate +=
							this.formulaForVariantField('conversionRate') === 'arithmetic-mean'
								? item.conversionRate / variantsCount
								: item.conversionRate;
						acc.refundRate +=
							this.formulaForVariantField('refundRate') === 'arithmetic-mean'
								? item.refundRate / variantsCount
								: item.refundRate;

						return acc;
					},
					{ stock: 0, pageView: 0, conversionRate: 0, refundRate: 0 }
				),
			};

			// * Find sorting score for the product
			// Sorting score is calculated based on sortingFormula passed as parameter
			// Formula is based on operator (as Operators enum) and operand which is translated to variant field value
			// With one exception, `fixedValue:X` is passed as operand
			let sumScore = '';
			for (const formula of sortingFormula) {
				const operator = Operators[formula.operator];
				const operand =
					formula.name.split(':')[0] === 'fixedValue'
						? formula.name.split(':')[1]
						: accumulatedProductData[formula.name];
				sumScore += `${operator} ${operand}`;
			}
			accumulatedProductData.sortingScore = eval(sumScore);

			// * Form the response object
			productResponse = { ...product, accumulatedProductData };
			productsResponse.push(productResponse);
		}

		return productsResponse.sort(
			(a, b) => b.accumulatedProductData.sortingScore - a.accumulatedProductData.sortingScore
		);
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
