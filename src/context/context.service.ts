import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { differenceInCalendarDays } from 'date-fns';
import { Model } from 'mongoose';
import {
  LineItem,
  LineItemDocument,
} from 'src/shopify/schemas/line-item.schema';

type Serie = {
  data: { x: string; y: number }[];
  evolution?: string;
  title?: { x: string; y: string };
  total?: number;
  types: string;
  temp_1?: number;
  temp_2?: number;
};

type Series = { [name: string]: Serie };

type Row = {
  _id: { period_type: string; period_start: Date };
  period: string;
  turnover: number;
  ad_spend: number;
  purchases_total: number;
  purchases_value_total: number;
  roas: number;
  cpa: number;
  orders_count: number;
  orders_avg_value: number;
  top_country: string;
  conversion_rate: number;
  abandonment_rate: number;
  vat: number;
  quantity: number;
  profit: number;
  profit_per_unit: number;
};

@Injectable()
export class ContextService {
  constructor(
    @InjectModel(LineItem.name) private lineItemModel: Model<LineItemDocument>,
  ) {}

  async dashboard(storeId: string, dayFrom: Date, dayTo: Date): Promise<any> {
    const lines = await this.lineItemModel
      .aggregate([
        {
          $match: {
            store_id: storeId,
            'created_at.date': { $gte: dayFrom, $lte: dayTo },
            'detail.line_item_refund_discrepancy': { $eq: 0 },
          },
        },
        {
          $group: {
            _id: {
              store_id: '$store_id',
              ...this.groupPeriod('created_at', dayFrom, dayTo),
            },
            turnover: { $sum: '$turnover' },
            // quantity: { $sum: '$quantity' },
            // profit: { $sum: '$profit' },
            order_ids: { $addToSet: '$order_id' },
          },
        },
        {
          $lookup: this.lookupFacebook(),
        },
        {
          $lookup: this.lookupGoogleAnalytics(),
        },
        {
          $project: {
            _id: 1,
            turnover: 1,
            // profit: 1,
            // profit_per_unit: {
            //   $round: [{ $divide: ['$profit', '$quantity'] }, 2],
            // },
            orders_count: { $size: '$order_ids' },
            orders_avg_value: {
              $round: [{ $divide: ['$turnover', { $size: '$order_ids' }] }, 2],
            },
            ad_spend_total: {
              $round: [
                {
                  $add: [
                    { $sum: '$facebook_docs.spend' },
                    { $sum: '$google_docs.ga:adCost' },
                  ],
                },
                2,
              ],
            },
            purchases_total: {
              $round: [
                {
                  $add: [
                    { $sum: '$facebook_docs.purchases_count' },
                    { $sum: '$google_docs.ga:transactions' },
                  ],
                },
                2,
              ],
            },
            purchases_value_total: {
              $round: [
                {
                  $add: [
                    { $sum: '$facebook_docs.purchases_value' },
                    { $sum: '$google_docs.ga:transactionRevenue' },
                  ],
                },
                2,
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            turnover: 1,
            orders_count: 1,
            orders_avg_value: 1,
            ad_spend: '$ad_spend_total',
            purchases_total: '$purchases_total',
            purchases_value_total: '$purchases_value_total',
            roas: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$purchases_value_total', null] },
                    { $ne: ['$purchases_value_total', 0] },
                    { $ne: ['$ad_spend_total', null] },
                    { $ne: ['$ad_spend_total', 0] },
                  ],
                },
                {
                  $round: [
                    {
                      $divide: ['$purchases_value_total', '$ad_spend_total'],
                    },
                    2,
                  ],
                },
                null,
              ],
            },
            cpa: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$ad_spend_total', null] },
                    { $ne: ['$ad_spend_total', 0] },
                    { $ne: ['$purchases_total', null] },
                    { $ne: ['$purchases_total', 0] },
                  ],
                },
                {
                  $round: [
                    {
                      $divide: ['$ad_spend_total', '$purchases_total'],
                    },
                    2,
                  ],
                },
                null,
              ],
            },
          },
        },
        { $sort: { '_id.period_start': 1 } },
      ])
      .exec();

    if (!lines.length) {
      return {
        data: null,
        from: dayFrom,
        to: dayTo,
      };
    }

    const period: string = lines[0]._id.period_type;

    const initialData = {
      data1: {
        sizes: { xs: 24, sm: 12, md: 8, xl: 6 },
        type: 'area',
        types: { x: period, y: 'currency' },
        title: 'Total Revenue',
        evolution: lines[0].turnover
          ? (lines[lines.length - 1].turnover - lines[0].turnover) /
            lines[0].turnover
          : null,
        data: [],
        total: 0,
      },
      data2: {
        sizes: { xs: 24, sm: 12, md: 8, xl: 6 },
        type: 'column',
        title: 'Adspend (global)',
        types: { x: period, y: 'currency' },
        evolution: lines[0].ad_spend
          ? (lines[lines.length - 1].ad_spend - lines[0].ad_spend) /
            lines[0].ad_spend
          : null,
        data: [],
        total: 0,
      },
      data3: {
        sizes: { xs: 24, sm: 12, md: 8, xl: 6 },
        type: 'line',
        title: 'ROAS',
        types: { x: period, y: 'number' },
        evolution: lines[0].roas
          ? (lines[lines.length - 1].roas - lines[0].roas) / lines[0].roas
          : null,
        data: [],
        temp_1: 0,
        temp_2: 0,
      },
      data4: {
        sizes: { xs: 24, sm: 12, md: 8, xl: 6 },
        type: 'line',
        title: 'CPA',
        types: { x: period, y: 'number' },
        evolution: lines[0].cpa
          ? (lines[lines.length - 1].cpa - lines[0].cpa) / lines[0].cpa
          : null,
        data: [],
        temp_1: 0,
        temp_2: 0,
      },
      data5: {
        types: {
          period,
          turnover: 'currency',
          orders_count: 'number',
          ad_spend: 'currency',
          roas: 'number',
          cpa: 'number',
        },
        columns: this.getColumns(),
        data: [],
      },
      data6: {
        sizes: { xs: 24, sm: 12, md: 8, xl: 6 },
        type: 'column',
        title: 'Total Orders',
        types: { x: period, y: 'number' },
        evolution: lines[0].orders_count
          ? (lines[lines.length - 1].orders_count - lines[0].orders_count) /
            lines[0].orders_count
          : null,
        data: [],
        total: 0,
      },
      data7: {
        sizes: { xs: 24, sm: 12, md: 8, xl: 6 },
        type: 'area',
        title: 'Average Order Value',
        types: { x: period, y: 'currency' },
        evolution: lines[0].orders_avg_value
          ? (lines[lines.length - 1].orders_avg_value -
              lines[0].orders_avg_value) /
            lines[0].orders_avg_value
          : null,
        data: [],
        total: 0,
      },
      data8: { title: 'Conversion Rate', data: [], total: 0, evolution: 0 },
      data9: { title: 'Abandonment Rate', data: [], total: 0, evolution: 0 },
    };

    const { data1, data2, data3, data4, data5, data6, data7, data8, data9 } = (
      lines || []
    ).reduce(
      (
        {
          data1,
          data2,
          data3,
          data4,
          data5,
          data6,
          data7,
          data8,
          data9,
        }: Series,
        row: Row,
        index: number,
      ) => {
        const {
          _id,
          turnover,
          ad_spend,
          purchases_total,
          purchases_value_total,
          roas,
          cpa,
          orders_count,
          orders_avg_value,
          conversion_rate,
          abandonment_rate,
        } = row;
        return {
          data1: {
            ...data1,
            data: [...data1.data, { x: _id.period_start, y: turnover }],
            total: data1.total + turnover,
          },
          data2: {
            ...data2,
            data: [...data2.data, { x: _id.period_start, y: ad_spend }],
            total: data2.total + ad_spend,
          },
          data3: {
            ...data3,
            data: [...data3.data, { x: _id.period_start, y: roas }],
            temp_1: data3.temp_1 + ad_spend,
            temp_2: data3.temp_2 + purchases_value_total,
            total:
              data3.temp_1 + ad_spend
                ? (data3.temp_2 + purchases_value_total) /
                  (data3.temp_1 + ad_spend)
                : null,
          },
          data4: {
            ...data4,
            data: [...data4.data, { x: _id.period_start, y: cpa }],
            temp_1: data4.temp_1 + purchases_total,
            temp_2: data4.temp_2 + ad_spend,
            total: (data4.temp_2 + ad_spend) / (data4.temp_1 + purchases_total),
          },
          data5: {
            ...data5,
            data: [
              {
                ...row,
                period: row._id.period_start,
                key: index,
              },
              ...data5.data,
            ],
          },
          data6: {
            ...data6,
            data: [...data6.data, { x: _id.period_start, y: orders_count }],
            total: data6.total + orders_count,
          },
          data7: {
            ...data7,
            data: [...data7.data, { x: _id.period_start, y: orders_avg_value }],
            total: (data1.total + turnover) / (data6.total + orders_count),
          },
          // data8: [ ...data8, { x: month, y: conversion_rate } ],
          // data9: [ ...data9, { x: month, y: abandonment_rate } ],
        };
      },
      initialData,
    );

    return {
      data: { data1, data2, data3, data4, data5, data6, data7 },
      from: dayFrom,
      to: dayTo,
    };
  }

  groupPeriod(dateField: string, dayFrom: Date, dayTo: Date) {
    const intervalInDays = differenceInCalendarDays(dayTo, dayFrom);
    // const differenceInDays = Math.round(
    //   Math.abs((dayTo.getTime() - dayFrom.getTime()) / (24 * 60 * 60 * 1000)),
    // );
    // console.log(dayFrom, dayTo, intervalInDays);

    const YEAR = 366;
    const QUARTER = 90;
    const TWO_WEEKS = 14;

    return intervalInDays - 1 > YEAR
      ? this.groupByYear(dateField)
      : intervalInDays > QUARTER
      ? this.groupByMonth(dateField)
      : intervalInDays > TWO_WEEKS
      ? this.groupByWeek(dateField)
      : this.groupByDay(dateField);
  }

  getColumns() {
    return [
      {
        title: 'Period',
        width: 300,
        // dataIndex: ['_id', 'period_start'],
        dataIndex: 'period',
        align: 'center',
      },
      {
        title: 'Turnover\n(VAT excluded)',
        width: 100,
        dataIndex: 'turnover',
        align: 'right',
      },
      {
        title: 'Quantity',
        width: 100,
        dataIndex: 'orders_count',
        align: 'right',
      },
      {
        title: 'AdSpend',
        width: 100,
        dataIndex: 'ad_spend',
        align: 'right',
      },
      {
        title: 'ROAS',
        width: 100,
        dataIndex: 'roas',
        align: 'right',
      },
      {
        title: 'CPA',
        width: 100,
        dataIndex: 'cpa',
        align: 'right',
      },
      // {
      //   title: 'Profit',
      //   width: 100,
      //   dataIndex: 'profit_f',
      //   align: 'right',
      // },
      // {
      //   title: 'Profit per unit',
      //   width: 100,
      //   dataIndex: 'profit_per_unit_f',
      //   align: 'right',
      // },
    ];
  }

  lookupFacebook() {
    return {
      from: 'facebook',
      let: {
        order_period_start: '$_id.period_start',
        order_period_end: '$_id.period_end',
        order_store_id: '$_id.store_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $gte: ['$date_start.date', '$$order_period_start'] },
                { $lte: ['$date_stop.date', '$$order_period_end'] },
                { $eq: ['$store_id', '$$order_store_id'] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            spend: { $toDouble: '$spend' },
            purchases_count: { $toDouble: '$purchases_count' },
            purchases_value: { $toDouble: '$purchases_value' },
          },
        },
      ],
      as: 'facebook_docs',
    };
  }

  lookupGoogleAnalytics() {
    return {
      from: 'google-analytics',
      let: {
        order_period_start: '$_id.period_start',
        order_period_end: '$_id.period_end',
        order_store_id: '$_id.store_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $gte: ['$ga:date.date', '$$order_period_start'] },
                { $lte: ['$ga:date.date', '$$order_period_end'] },
                { $eq: ['$store_id', '$$order_store_id'] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            'ga:adCost': { $toDouble: '$ga:adCost' },
            'ga:transactions': { $toDouble: '$ga:transactions' },
            'ga:transactionRevenue': { $toDouble: '$ga:transactionRevenue' },
          },
        },
      ],
      as: 'google_docs',
    };
  }

  groupByDay(date: string) {
    return {
      period_timezone: `$${date}.timezone`,
      period_type: 'day',
      period_start: {
        $dateFromParts: {
          year: {
            $year: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          month: {
            $month: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          day: {
            $dayOfMonth: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          timezone: `$${date}.timezone`,
        },
      },
      period_end: {
        $subtract: [
          {
            $dateFromParts: {
              year: {
                $year: {
                  date: `$${date}.date`,
                  timezone: `$${date}.timezone`,
                },
              },
              month: {
                $month: {
                  date: `$${date}.date`,
                  timezone: `$${date}.timezone`,
                },
              },
              day: {
                $add: [
                  {
                    $dayOfMonth: {
                      date: `$${date}.date`,
                      timezone: `$${date}.timezone`,
                    },
                  },
                  1,
                ],
              },
              timezone: `$${date}.timezone`,
            },
          },
          1,
        ],
      },
    };
  }

  groupByWeek(date: string) {
    return {
      period_timezone: `$${date}.timezone`,
      period_type: 'week',
      period_start: {
        $dateFromParts: {
          isoWeekYear: {
            $isoWeekYear: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          isoWeek: {
            $isoWeek: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          timezone: `$${date}.timezone`,
        },
      },
      period_end: {
        $subtract: [
          {
            $dateFromParts: {
              isoWeekYear: {
                $isoWeekYear: {
                  date: `$${date}.date`,
                  timezone: `$${date}.timezone`,
                },
              },
              isoWeek: {
                $add: [
                  {
                    $isoWeek: {
                      date: `$${date}.date`,
                      timezone: `$${date}.timezone`,
                    },
                  },
                  1,
                ],
              },
              timezone: `$${date}.timezone`,
            },
          },
          1,
        ],
      },
    };
  }

  groupByMonth(date: string) {
    return {
      period_timezone: `$${date}.timezone`,
      period_type: 'month',
      period_start: {
        $dateFromParts: {
          year: {
            $year: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          month: {
            $month: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          timezone: `$${date}.timezone`,
        },
      },
      period_end: {
        $subtract: [
          {
            $dateFromParts: {
              year: {
                $year: {
                  date: `$${date}.date`,
                  timezone: `$${date}.timezone`,
                },
              },
              month: {
                $add: [
                  {
                    $month: {
                      date: `$${date}.date`,
                      timezone: `$${date}.timezone`,
                    },
                  },
                  1,
                ],
              },
              timezone: `$${date}.timezone`,
            },
          },
          1,
        ],
      },
    };
  }

  groupByYear(date: string) {
    return {
      period_timezone: `$${date}.timezone`,
      period_type: 'year',
      period_start: {
        $dateFromParts: {
          year: {
            $year: {
              date: `$${date}.date`,
              timezone: `$${date}.timezone`,
            },
          },
          timezone: `$${date}.timezone`,
        },
      },
      period_end: {
        $subtract: [
          {
            $dateFromParts: {
              year: {
                $add: [
                  {
                    $year: {
                      date: `$${date}.date`,
                      timezone: `$${date}.timezone`,
                    },
                  },
                  1,
                ],
              },
              timezone: `$${date}.timezone`,
            },
          },
          1,
        ],
      },
    };
  }

  async test_ranges() {
    const date = 'created_at';

    return await this.lineItemModel.aggregate([
      {
        $match: {
          [`${date}.date`]: {
            $gt: new Date('2020-10-24T23:00:00+02:00'),
            $lt: new Date('2020-10-25T03:00:00+02:00'),
          },
        },
      },
      {
        $project: {
          date_field: `${date}`,
          date: `$${date}.date`,
          date_timezone: `$${date}.timezone`,
          year: this.groupByYear(date),
          month: this.groupByMonth(date),
          week: this.groupByWeek(date),
          day: this.groupByDay(date),
        },
      },
    ]);
  }
}
