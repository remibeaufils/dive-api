import { Injectable } from '@nestjs/common';
import { isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';

@Injectable()
export class ContextSDUIService {
  dashboardSDUI(monthFrom = null, monthTo = null): any {
    if (!monthFrom && !monthTo) return data;

    if (!monthFrom)
      return data.filter(({ month }) => isBefore(parseISO(month), monthTo));

    if (!monthTo)
      return data.filter(({ month }) => isAfter(parseISO(month), monthFrom));

    response.dataSources[0].data = data.filter(({ month }) =>
      isWithinInterval(parseISO(month), {
        start: monthFrom,
        end: monthTo,
      }),
    );

    return response;
  }
}

const data = [
  {
    month: '2020-01',
    totalRevenue: 100000, // Shopify
    adspendGlobal: 21,
    roas: 5.2,
    cpa: 20,
    totalOrders: 3500, // Shopify
    averageOrderValue: 70, // Shopify
    topCountry: 'France',
    abandonmentRate: 0.8, // Shopify
    vat: 316708.98, // Shopify
    quantity: 4720, // Shopify
    profit: 145567, // Shopify
    profitPerUnit: 21.4, // Shopify
  },
  {
    month: '2020-02',
    totalRevenue: 200000,
    adspendGlobal: 27,
    roas: 5.32,
    cpa: 20.56,
    totalOrders: 3900,
    averageOrderValue: 62,
    topCountry: 'UK',
    abandonmentRate: 0.9,
    vat: 326908.98,
    quantity: 5540,
    profit: 150853,
    profitPerUnit: 23.64,
  },
  {
    month: '2020-03',
    totalRevenue: 300000,
    adspendGlobal: 32,
    roas: 5.28,
    cpa: 20.9,
    totalOrders: 3800,
    averageOrderValue: 70,
    topCountry: 'Germany',
    abandonmentRate: 0.8,
    vat: 333908.23,
    quantity: 6890,
    profit: 150987,
    profitPerUnit: 22,
  },
  {
    month: '2020-04',
    totalRevenue: 400000,
    adspendGlobal: 40,
    roas: 5.8,
    cpa: 21,
    totalOrders: 4200,
    averageOrderValue: 51,
    topCountry: 'Spain',
    abandonmentRate: 0.7,
    vat: 345823.01,
    quantity: 7353,
    profit: 145233,
    profitPerUnit: 21.43,
  },
  {
    month: '2020-05',
    totalRevenue: 500000,
    adspendGlobal: 55,
    roas: 5.85,
    cpa: 21.34,
    totalOrders: 4500,
    averageOrderValue: 59,
    topCountry: 'USA',
    abandonmentRate: 0.6,
    vat: 299890.1,
    quantity: 4321,
    profit: 144901,
    profitPerUnit: 24.56,
  },
  {
    month: '2020-06',
    totalRevenue: 600000,
    adspendGlobal: 60,
    roas: 6,
    cpa: 23.01,
    totalOrders: 4200,
    averageOrderValue: 70,
    topCountry: 'USA',
    abandonmentRate: 0.5,
    vat: 298112.02,
    quantity: 4219,
    profit: 132813,
    profitPerUnit: 30.32,
  },
  {
    month: '2020-07',
    totalRevenue: 700000,
    adspendGlobal: 68,
    roas: 6.04,
    cpa: 23.34,
    totalOrders: 4600,
    averageOrderValue: 60,
    topCountry: 'USA',
    abandonmentRate: 0.4,
    vat: 301756.1,
    quantity: 4452,
    profit: 139648,
    profitPerUnit: 31.45,
  },
  {
    month: '2020-08',
    totalRevenue: 800000,
    adspendGlobal: 75,
    roas: 6.55,
    cpa: 23.45,
    totalOrders: 5000,
    averageOrderValue: 62,
    topCountry: 'USA',
    abandonmentRate: 0.36,
    vat: 310981.34,
    quantity: 4786,
    profit: 143094,
    profitPerUnit: 26.64,
  },
  {
    month: '2020-09',
    totalRevenue: 900000,
    adspendGlobal: 70,
    roas: 6.9,
    cpa: 24,
    totalOrders: 5100,
    averageOrderValue: 61,
    topCountry: 'USA',
    abandonmentRate: 0.32,
    vat: 355123.43,
    quantity: 9801,
    profit: 148987,
    profitPerUnit: 25.95,
  },
  {
    month: '2020-10',
    totalRevenue: 1000000,
    adspendGlobal: 80,
    roas: 7.01,
    cpa: 24.33,
    totalOrders: 5200,
    averageOrderValue: 70,
    topCountry: 'USA',
    abandonmentRate: 0.3,
    vat: 321093.43,
    quantity: 5101,
    profit: 150234,
    profitPerUnit: 26.09,
  },
  {
    month: '2020-11',
    totalRevenue: 1100000,
    adspendGlobal: 88,
    roas: 7.55,
    cpa: 25.07,
    totalOrders: 5000,
    averageOrderValue: 59,
    topCountry: 'USA',
    abandonmentRate: 0.29,
    vat: 319819.98,
    quantity: 4999,
    profit: 153180,
    profitPerUnit: 29.11,
  },
  {
    month: '2020-12',
    totalRevenue: 1200000,
    adspendGlobal: 100,
    roas: 8.3,
    cpa: 26.05,
    totalOrders: 5300,
    averageOrderValue: 64,
    topCountry: 'USA',
    abandonmentRate: 0.31,
    vat: 302204.821,
    quantity: 4597,
    profit: 154208,
    profitPerUnit: 22.46,
  },
];

const response = {
  components: [
    {
      index: 1,
      sizing: { md: 24, lg: 6 },
      type: 'ChartArea',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'Total Revenue',
        x: 'month',
        y: 'totalRevenue',
        // color: undefined,
        // height: undefined,
        // color: ...,
        // point: ...,
        // shape: ...,
      },
    },
    {
      index: 2,
      sizing: { md: 24, lg: 6 },
      type: 'ChartColumn',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'AdSpend',
        x: 'month',
        y: 'adspendGlobal',
      },
    },
    {
      index: 3,
      sizing: { md: 24, lg: 6 },
      type: 'ChartArea',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'ROAS',
        x: 'month',
        y: 'roas',
      },
    },
    {
      index: 4,
      sizing: { md: 24, lg: 6 },
      type: 'ChartArea',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'CPA',
        x: 'month',
        y: 'cpa',
      },
    },
    {
      index: 5,
      sizing: { xs: 24 },
      type: 'Table',
      dataSourceName: 'main',
      data: [],
      config: {
        columns: [
          {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
          },
          {
            title: 'Turnover (VAT excluded) in USD',
            dataIndex: 'vat',
            key: 'vat',
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
          },
          {
            title: 'AdSpend',
            key: 'adspendGlobal',
            dataIndex: 'adspendGlobal',
          },
          {
            title: 'ROAS',
            key: 'roas',
            dataIndex: 'roas',
          },
          {
            title: 'CPA',
            key: 'cpa',
            dataIndex: 'cpa',
          },
          {
            title: 'Profit (USD)',
            key: 'profit',
            dataIndex: 'profit',
          },
          {
            title: 'Profit per unit (USD)',
            key: 'profitPerUnit',
            dataIndex: 'profitPerUnit',
          },
        ],
      },
    },
    {
      index: 6,
      sizing: { md: 24, lg: 6 },
      type: 'ChartArea',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'Total Orders',
        x: 'month',
        y: 'totalOrders',
      },
    },
    {
      index: 7,
      sizing: { md: 24, lg: 6 },
      type: 'ChartArea',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'Average Order Value',
        x: 'month',
        y: 'averageOrderValue',
      },
    },
    {
      index: 8,
      sizing: { md: 24, lg: 6 },
      type: '',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'Top countries',
      },
    },
    {
      index: 9,
      sizing: { md: 24, lg: 6 },
      type: 'ChartArea',
      dataSourceName: 'main',
      data: [],
      config: {
        title: 'Abandonment Rate',
        x: 'month',
        y: 'abandonmentRate',
      },
    },
  ],
  dataSources: [
    {
      name: 'main',
      data: [],
    },
  ],
};

const data2 = [
  /* 1 */
  {
    sumTurnover: 6416.34,
    sumProfit: 6202.4,
    sumQuantity: 43,
    day: '2019-02-24T00:00:00.000Z',
    sumProfitPerUnit: 144.241860465116,
  },

  /* 2 */
  {
    sumTurnover: 4608,
    sumProfit: 4379,
    sumQuantity: 27,
    day: '2019-03-12T00:00:00.000Z',
    sumProfitPerUnit: 162.185185185185,
  },

  /* 3 */
  {
    sumTurnover: 1532.0,
    sumProfit: 1527,
    sumQuantity: 14,
    day: '2019-08-25T00:00:00.000Z',
    sumProfitPerUnit: 109.071428571429,
  },

  /* 4 */
  {
    sumTurnover: 2990.8,
    sumProfit: 2969.3,
    sumQuantity: 18,
    day: '2019-06-08T00:00:00.000Z',
    sumProfitPerUnit: 164.961111111111,
  },

  /* 5 */
  {
    sumTurnover: 7706.38,
    sumProfit: 7294.0,
    sumQuantity: 56,
    day: '2019-12-02T00:00:00.000Z',
    sumProfitPerUnit: 130.25,
  },

  /* 6 */
  {
    sumTurnover: 5758.1,
    sumProfit: 5128.2,
    sumQuantity: 39,
    day: '2019-12-20T00:00:00.000Z',
    sumProfitPerUnit: 131.492307692308,
  },

  /* 7 */
  {
    sumTurnover: 2103.0,
    sumProfit: 1965,
    sumQuantity: 18,
    day: '2019-11-01T00:00:00.000Z',
    sumProfitPerUnit: 109.166666666667,
  },

  /* 8 */
  {
    sumTurnover: 18087.7,
    sumProfit: 16348.1,
    sumQuantity: 160,
    day: '2020-03-09T00:00:00.000Z',
    sumProfitPerUnit: 102.175625,
  },

  /* 9 */
  {
    sumTurnover: 1559,
    sumProfit: 1331,
    sumQuantity: 7,
    day: '2019-05-17T00:00:00.000Z',
    sumProfitPerUnit: 190.142857142857,
  },

  /* 10 */
  {
    sumTurnover: 2275.9,
    sumProfit: 2251,
    sumQuantity: 18,
    day: '2019-11-09T00:00:00.000Z',
    sumProfitPerUnit: 125.055555555556,
  },

  /* 11 */
  {
    sumTurnover: 8607.4,
    sumProfit: 8236,
    sumQuantity: 61,
    day: '2019-11-29T00:00:00.000Z',
    sumProfitPerUnit: 135.016393442623,
  },

  /* 12 */
  {
    sumTurnover: 2200.94,
    sumProfit: 2102,
    sumQuantity: 19,
    day: '2019-03-10T00:00:00.000Z',
    sumProfitPerUnit: 110.631578947368,
  },

  /* 13 */
  {
    sumTurnover: 4801.3,
    sumProfit: 4406.0,
    sumQuantity: 32,
    day: '2019-09-05T00:00:00.000Z',
    sumProfitPerUnit: 137.6875,
  },

  /* 14 */
  {
    sumTurnover: 133,
    sumProfit: 133,
    sumQuantity: 7,
    day: '2020-04-15T00:00:00.000Z',
    sumProfitPerUnit: 19.0,
  },

  /* 15 */
  {
    sumTurnover: 1599.5,
    sumProfit: 1559.0,
    sumQuantity: 61,
    day: '2020-09-01T00:00:00.000Z',
    sumProfitPerUnit: 25.5573770491803,
  },

  /* 16 */
  {
    sumTurnover: 1944,
    sumProfit: 1765,
    sumQuantity: 14,
    day: '2019-10-06T00:00:00.000Z',
    sumProfitPerUnit: 126.071428571429,
  },

  /* 17 */
  {
    sumTurnover: 1361.28,
    sumProfit: 1270,
    sumQuantity: 10,
    day: '2018-10-22T00:00:00.000Z',
    sumProfitPerUnit: 127.0,
  },

  /* 18 */
  {
    sumTurnover: 12277.0,
    sumProfit: 9721,
    sumQuantity: 109,
    day: '2020-03-12T00:00:00.000Z',
    sumProfitPerUnit: 89.1834862385321,
  },

  /* 19 */
  {
    sumTurnover: 57,
    sumProfit: 57,
    sumQuantity: 3,
    day: '2020-04-04T00:00:00.000Z',
    sumProfitPerUnit: 19.0,
  },

  /* 20 */
  {
    sumTurnover: 821.4,
    sumProfit: 812.4,
    sumQuantity: 36,
    day: '2020-09-02T00:00:00.000Z',
    sumProfitPerUnit: 22.5666666666667,
  },

  /* 21 */
  {
    sumTurnover: 228,
    sumProfit: 228,
    sumQuantity: 12,
    day: '2020-04-22T00:00:00.000Z',
    sumProfitPerUnit: 19.0,
  },

  /* 22 */
  {
    sumTurnover: 319,
    sumProfit: 314,
    sumQuantity: 16,
    day: '2020-06-10T00:00:00.000Z',
    sumProfitPerUnit: 19.625,
  },

  /* 23 */
  {
    sumTurnover: 3888.76,
    sumProfit: 3835,
    sumQuantity: 30,
    day: '2018-11-05T00:00:00.000Z',
    sumProfitPerUnit: 127.833333333333,
  },

  /* 24 */
  {
    sumTurnover: 1411.02,
    sumProfit: 1396,
    sumQuantity: 10,
    day: '2018-12-29T00:00:00.000Z',
    sumProfitPerUnit: 139.6,
  },

  /* 25 */
  {
    sumTurnover: 1365.14,
    sumProfit: 1298,
    sumQuantity: 11,
    day: '2019-01-28T00:00:00.000Z',
    sumProfitPerUnit: 118.0,
  },

  /* 26 */
  {
    sumTurnover: 2309.9,
    sumProfit: 1927,
    sumQuantity: 13,
    day: '2019-07-16T00:00:00.000Z',
    sumProfitPerUnit: 148.230769230769,
  },

  /* 27 */
  {
    sumTurnover: 7900.42,
    sumProfit: 7365.0,
    sumQuantity: 45,
    day: '2018-12-16T00:00:00.000Z',
    sumProfitPerUnit: 163.666666666667,
  },

  /* 28 */
  {
    sumTurnover: 2705.2,
    sumProfit: 2442.2,
    sumQuantity: 15,
    day: '2019-06-14T00:00:00.000Z',
    sumProfitPerUnit: 162.813333333333,
  },

  /* 29 */
  {
    sumTurnover: 1148.9,
    sumProfit: 1134,
    sumQuantity: 9,
    day: '2019-06-29T00:00:00.000Z',
    sumProfitPerUnit: 126.0,
  },

  /* 30 */
  {
    sumTurnover: 4067.2,
    sumProfit: 3948.3,
    sumQuantity: 31,
    day: '2019-09-19T00:00:00.000Z',
    sumProfitPerUnit: 127.364516129032,
  },

  /* 31 */
  {
    sumTurnover: 2893.59,
    sumProfit: 2570,
    sumQuantity: 20,
    day: '2019-02-10T00:00:00.000Z',
    sumProfitPerUnit: 128.5,
  },

  /* 32 */
  {
    sumTurnover: 2860.82,
    sumProfit: 2757,
    sumQuantity: 21,
    day: '2018-11-16T00:00:00.000Z',
    sumProfitPerUnit: 131.285714285714,
  },

  /* 33 */
  {
    sumTurnover: 2786.46,
    sumProfit: 2471,
    sumQuantity: 19,
    day: '2019-01-13T00:00:00.000Z',
    sumProfitPerUnit: 130.052631578947,
  },

  /* 34 */
  {
    sumTurnover: 1042.62,
    sumProfit: 1003,
    sumQuantity: 7,
    day: '2018-10-05T00:00:00.000Z',
    sumProfitPerUnit: 143.285714285714,
  },

  /* 35 */
  {
    sumTurnover: 1504.9,
    sumProfit: 1475.1,
    sumQuantity: 12,
    day: '2019-04-14T00:00:00.000Z',
    sumProfitPerUnit: 122.925,
  },

  /* 36 */
  {
    sumTurnover: 33205.3,
    sumProfit: 31731.0,
    sumQuantity: 272,
    day: '2020-01-26T00:00:00.000Z',
    sumProfitPerUnit: 116.658088235294,
  },

  /* 37 */
  {
    sumTurnover: 38,
    sumProfit: 19,
    sumQuantity: 1,
    day: '2020-03-26T00:00:00.000Z',
    sumProfitPerUnit: 19.0,
  },

  /* 38 */
  {
    sumTurnover: 418,
    sumProfit: 418,
    sumQuantity: 22,
    day: '2020-06-11T00:00:00.000Z',
    sumProfitPerUnit: 19.0,
  },

  /* 39 */
  {
    sumTurnover: 384,
    sumProfit: 384,
    sumQuantity: 21,
    day: '2020-04-27T00:00:00.000Z',
    sumProfitPerUnit: 18.2857142857143,
  },

  /* 40 */
  {
    sumTurnover: 1771.9,
    sumProfit: 1420,
    sumQuantity: 9,
    day: '2019-08-16T00:00:00.000Z',
    sumProfitPerUnit: 157.777777777778,
  },

  /* 41 */
  {
    sumTurnover: 1698.5,
    sumProfit: 1660.5,
    sumQuantity: 58,
    day: '2020-08-31T00:00:00.000Z',
    sumProfitPerUnit: 28.6293103448276,
  },

  /* 42 */
  {
    sumTurnover: 475.1,
    sumProfit: 454.6,
    sumQuantity: 19,
    day: '2020-08-17T00:00:00.000Z',
    sumProfitPerUnit: 23.9263157894737,
  },

  /* 43 */
  {
    sumTurnover: 4169.1,
    sumProfit: 3933,
    sumQuantity: 23,
    day: '2019-01-30T00:00:00.000Z',
    sumProfitPerUnit: 171.0,
  },

  /* 44 */
  {
    sumTurnover: 35166.0,
    sumProfit: 32190.1,
    sumQuantity: 357,
    day: '2020-02-02T00:00:00.000Z',
    sumProfitPerUnit: 90.1683473389356,
  },

  /* 45 */
  {
    sumTurnover: 15368.0,
    sumProfit: 14555.0,
    sumQuantity: 165,
    day: '2020-02-12T00:00:00.000Z',
    sumProfitPerUnit: 88.2121212121212,
  },

  /* 46 */
  {
    sumTurnover: 467,
    sumProfit: 467,
    sumQuantity: 3,
    day: '2019-05-11T00:00:00.000Z',
    sumProfitPerUnit: 155.666666666667,
  },

  /* 47 */
  {
    sumTurnover: 12438.9,
    sumProfit: 11311,
    sumQuantity: 97,
    day: '2020-01-23T00:00:00.000Z',
    sumProfitPerUnit: 116.60824742268,
  },

  /* 48 */
  {
    sumTurnover: 1601.02,
    sumProfit: 1586,
    sumQuantity: 12,
    day: '2018-11-11T00:00:00.000Z',
    sumProfitPerUnit: 132.166666666667,
  },

  /* 49 */
  {
    sumTurnover: 95,
    sumProfit: 95,
    sumQuantity: 5,
    day: '2020-04-19T00:00:00.000Z',
    sumProfitPerUnit: 19.0,
  },

  /* 50 */
  {
    sumTurnover: 748.02,
    sumProfit: 604,
    sumQuantity: 5,
    day: '2018-11-09T00:00:00.000Z',
    sumProfitPerUnit: 120.8,
  },
];
