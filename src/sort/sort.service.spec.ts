import { Test, TestingModule } from '@nestjs/testing';
import { SortService } from './sort.service';

describe('SortService', () => {
  let service: SortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SortService],
    }).compile();

    service = module.get<SortService>(SortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct result with data set 1', () => {
    const mockSortingFormula = [
      {
        operator: 'first',
        name: 'stock',
      },
      {
        operator: 'add',
        name: 'pageView',
      },
      {
        operator: 'mul',
        name: 'price',
      },
      {
        operator: 'mul',
        name: 'fixedValue:3',
      },
      {
        operator: 'div',
        name: 'conversionRate',
      },
    ];

    const mockProducts = [
      {
        name: 'Amazing Tshirt',
        price: 100,
        variants: [
          {
            name: 'White / Small',
            stock: 3,
            pageView: 2,
            conversionRate: 2,
          },
          {
            name: 'White / Medium',
            stock: 4,
            pageView: 2,
            conversionRate: 7,
          },
          {
            name: 'White / Large', // 100    192
            stock: 5, // 12
            pageView: 5, // 3
            conversionRate: 6, // 5
          },
        ],
      },
      {
        name: 'Ooooversize Tshirt',
        price: 80,
        variants: [
          {
            name: 'White / Small',
            stock: 4,
            pageView: 3,
            conversionRate: 5,
          },
          {
            name: 'White / Medium',
            stock: 3,
            pageView: 6,
            conversionRate: 9,
          },
          {
            name: 'White / Large', // 80    257
            stock: 10, // 17
            pageView: 9, // 6
            conversionRate: 4, // 6
          },
        ],
      },
      {
        name: 'SLIM Tshirt',
        price: 75,
        variants: [
          {
            name: 'White / Small',
            stock: 6,
            pageView: 2,
            conversionRate: 1,
          },
          {
            name: 'White / Medium',
            stock: 4,
            pageView: 4,
            conversionRate: 10,
          },
          {
            name: 'White / Large', // 75  238
            stock: 3, // 13
            pageView: 6, // 4
            conversionRate: 1, // 4
          },
        ],
      },
    ];

    const sortedProducts = service.sortProducts(mockProducts, mockSortingFormula);

    expect(sortedProducts[0].name).toEqual('Ooooversize Tshirt');
    expect(sortedProducts[1].name).toEqual('SLIM Tshirt');
    expect(sortedProducts[2].name).toEqual('Amazing Tshirt');

    expect(sortedProducts[0]['accumulatedProductData']['stock']).toEqual(17);
    expect(sortedProducts[0]['accumulatedProductData']['pageView']).toEqual(6);
    expect(sortedProducts[0]['accumulatedProductData']['conversionRate']).toEqual(6);
    expect(sortedProducts[0]['accumulatedProductData']['price']).toEqual(80);
    expect(sortedProducts[0]['accumulatedProductData']['sortingScore']).toEqual(257);

    expect(sortedProducts[1]['accumulatedProductData']['stock']).toEqual(13);
    expect(sortedProducts[1]['accumulatedProductData']['pageView']).toEqual(4);
    expect(sortedProducts[1]['accumulatedProductData']['conversionRate']).toEqual(4);
    expect(sortedProducts[1]['accumulatedProductData']['price']).toEqual(75);
    expect(sortedProducts[1]['accumulatedProductData']['sortingScore']).toEqual(238);

    expect(sortedProducts[2]['accumulatedProductData']['stock']).toEqual(12);
    expect(sortedProducts[2]['accumulatedProductData']['pageView']).toEqual(3);
    expect(sortedProducts[2]['accumulatedProductData']['conversionRate']).toEqual(5);
    expect(sortedProducts[2]['accumulatedProductData']['price']).toEqual(100);
    expect(sortedProducts[2]['accumulatedProductData']['sortingScore']).toEqual(192);
  });

  it('should return correct result with data set 2', () => {
    const mockSortingFormula = [
      {
        operator: 'first',
        name: 'stock',
      },
      {
        operator: 'add',
        name: 'pageView',
      },
      {
        operator: 'sub',
        name: 'refundRate',
      },
    ];

    const mockProducts = [
      {
        name: 'Amazing Tshirt',
        price: 100,
        variants: [
          {
            name: 'White / Small',
            stock: 3,
            pageView: 2,
            refundRate: 2,
          },
          {
            name: 'White / Medium',
            stock: 4,
            pageView: 2,
            refundRate: 7,
          },
          {
            name: 'White / Large', // score 18
            stock: 13, // 20
            pageView: 5, // 3
            refundRate: 6, // 5
          },
        ],
      },
      {
        name: 'Ooooversize Tshirt',
        price: 80,
        variants: [
          {
            name: 'White / Small',
            stock: 4,
            pageView: 3,
            refundRate: 5,
          },
          {
            name: 'White / Medium',
            stock: 3,
            pageView: 6,
            refundRate: 9,
          },
          {
            name: 'White / Large', // score 17
            stock: 10, // 17
            pageView: 9, // 6
            refundRate: 4, // 6
          },
        ],
      },
      {
        name: 'SLIM Tshirt',
        price: 75,
        variants: [
          {
            name: 'White / Small',
            stock: 6,
            pageView: 2,
            refundRate: 1,
          },
          {
            name: 'White / Medium',
            stock: 4,
            pageView: 4,
            refundRate: 10,
          },
          {
            name: 'White / Large', // score: 13
            stock: 3, // 13
            pageView: 6, // 4
            refundRate: 1, // 4
          },
        ],
      },
    ];

    const sortedProducts = service.sortProducts(mockProducts, mockSortingFormula);

    expect(sortedProducts[0].name).toEqual('Amazing Tshirt');
    expect(sortedProducts[1].name).toEqual('Ooooversize Tshirt');
    expect(sortedProducts[2].name).toEqual('SLIM Tshirt');

    expect(sortedProducts[0]['accumulatedProductData']['stock']).toEqual(20);
    expect(sortedProducts[0]['accumulatedProductData']['pageView']).toEqual(3);
    expect(sortedProducts[0]['accumulatedProductData']['refundRate']).toEqual(5);
    expect(sortedProducts[0]['accumulatedProductData']['sortingScore']).toEqual(18);

    expect(sortedProducts[1]['accumulatedProductData']['stock']).toEqual(17);
    expect(sortedProducts[1]['accumulatedProductData']['pageView']).toEqual(6);
    expect(sortedProducts[1]['accumulatedProductData']['refundRate']).toEqual(6);
    expect(sortedProducts[1]['accumulatedProductData']['sortingScore']).toEqual(17);

    expect(sortedProducts[2]['accumulatedProductData']['stock']).toEqual(13);
    expect(sortedProducts[2]['accumulatedProductData']['pageView']).toEqual(4);
    expect(sortedProducts[2]['accumulatedProductData']['refundRate']).toEqual(4);
    expect(sortedProducts[2]['accumulatedProductData']['sortingScore']).toEqual(13);
  });
});
