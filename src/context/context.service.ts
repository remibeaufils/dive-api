import { Injectable } from '@nestjs/common';
import { isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';

@Injectable()
export class ContextService {
  dashboard(monthFrom = null, monthTo = null): any {
    if (!monthFrom && !monthTo) return data;

    if (!monthFrom)
      return data.filter(({ month }) => isBefore(parseISO(month), monthTo));

    if (!monthTo)
      return data.filter(({ month }) => isAfter(parseISO(month), monthFrom));

    return data.filter(({ month }) =>
      isWithinInterval(parseISO(month), {
        start: monthFrom,
        end: monthTo,
      }),
    );
  }

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
