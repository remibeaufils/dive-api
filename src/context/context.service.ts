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
  total?: number;
  temp_1?: number;
  temp_2?: number;
  total_f?: string;
  first?: number;
  last?: number;
  evolution?: string;
};

// type Series = { [name: string]: { x: string; y: number }[] };
type Series = { [name: string]: Serie };

type DataRow = {
  _id: { period_type: string; period_start: Date };
  turnover: number;
  ad_spend: number;
  purchases_total: number;
  purchases_value_total: number;
  roas: number;
  cpa: number;
  orders_count: number;
  orders_avg_value: number;
  topCountry: string;
  conversionRate: number;
  abandonmentRate: number;
  vat: number;
  quantity: number;
  profit: number;
  profit_per_unit: number;
};

@Injectable()
export class ContextService {
  private dateFormatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
    // timeZoneName: 'short',
  });

  private monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  });

  private yearFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone: 'Europe/Paris',
  });

  private currencyFormatter = new Intl.NumberFormat('en-US', {
    currency: 'EUR',
    // @ts-ignore https://github.com/microsoft/TypeScript/pull/40709
    // notation: 'compact',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    style: 'currency',
  });

  private numberFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });

  private percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  });

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
        dataRow: DataRow,
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
          conversionRate,
          abandonmentRate,
        } = dataRow;
        return {
          data1: {
            ...data1,
            data: [...data1.data, { x: _id.period_start, y: turnover }],
            total: data1.total + turnover,
            total_f: this.currencyFormatter.format(data1.total + turnover),
            evolution: this.percentFormatter.format(
              (lines[lines.length - 1].turnover - lines[0].turnover) /
                lines[0].turnover,
            ),
          },
          data2: {
            ...data2,
            data: [...data2.data, { x: _id.period_start, y: ad_spend }],
            total: data2.total + ad_spend,
            total_f: this.currencyFormatter.format(data2.total + ad_spend),
            evolution: lines[0].ad_spend
              ? this.percentFormatter.format(
                  (lines[lines.length - 1].ad_spend - lines[0].ad_spend) /
                    lines[0].ad_spend,
                )
              : data2.evolution,
          },
          data3: {
            ...data3,
            data: [...data3.data, { x: _id.period_start, y: roas }],
            temp_1: data3.temp_1 + ad_spend,
            temp_2: data3.temp_2 + purchases_value_total,
            total_f:
              data3.temp_1 + ad_spend
                ? this.numberFormatter.format(
                    (data3.temp_2 + purchases_value_total) /
                      (data3.temp_1 + ad_spend),
                  )
                : null,
            evolution: lines[0].roas
              ? this.percentFormatter.format(
                  (lines[lines.length - 1].roas - lines[0].roas) /
                    lines[0].roas,
                )
              : data3.evolution,
          },
          data4: {
            ...data4,
            data: [...data4.data, { x: _id.period_start, y: cpa }],
            temp_1: data4.temp_1 + purchases_total,
            temp_2: data4.temp_2 + ad_spend,
            total_f:
              data4.temp_1 + purchases_total
                ? this.numberFormatter.format(
                    (data4.temp_2 + ad_spend) /
                      (data4.temp_1 + purchases_total),
                  )
                : null,
            evolution: lines[0].cpa
              ? this.percentFormatter.format(
                  (lines[lines.length - 1].cpa - lines[0].cpa) / lines[0].cpa,
                )
              : data4.evolution,
          },
          data5: {
            ...data5,
            data: [
              ...data5.data,
              {
                ...dataRow,
                period_f:
                  dataRow._id.period_type === 'year'
                    ? `Year ${this.yearFormatter.format(_id.period_start)}`
                    : _id.period_type === 'month'
                    ? this.monthFormatter.format(dataRow._id.period_start)
                    : _id.period_type === 'week'
                    ? `Week of ${this.dateFormatter
                        .format(_id.period_start)
                        .replace(/,/g, '')}`
                    : this.dateFormatter.format(dataRow._id.period_start),
                turnover_f: this.currencyFormatter.format(turnover),
                orders_count_f: this.numberFormatter.format(orders_count),
                ad_spend_f: ad_spend
                  ? this.currencyFormatter.format(ad_spend)
                  : null,
                cpa_f: cpa ? this.currencyFormatter.format(cpa) : null,
                roas_f: roas ? this.numberFormatter.format(roas) : null,
              },
            ],
          },
          data6: {
            ...data6,
            data: [...data6.data, { x: _id.period_start, y: orders_count }],
            total: data6.total + orders_count,
            total_f: this.numberFormatter.format(data6.total + orders_count),
            evolution: this.percentFormatter.format(
              (lines[lines.length - 1].orders_count - lines[0].orders_count) /
                lines[0].orders_count,
            ),
          },
          data7: {
            ...data7,
            data: [...data7.data, { x: _id.period_start, y: orders_avg_value }],
            total: (data1.total + turnover) / (data6.total + orders_count),
            total_f: this.currencyFormatter.format(
              (data1.total + turnover) / (data6.total + orders_count),
            ),
            evolution: this.percentFormatter.format(
              (lines[lines.length - 1].orders_avg_value -
                lines[0].orders_avg_value) /
                lines[0].orders_avg_value,
            ),
          },
          // data8: [ ...data8, { x: month, y: conversionRate } ],
          // data9: [ ...data9, { x: month, y: abandonmentRate } ],
        };
      },
      {
        data1: { data: [], total: 0, evolution: '0' },
        data2: { data: [], total: 0, evolution: '0' },
        data3: { data: [], temp_1: 0, temp_2: 0, evolution: '0' },
        data4: { data: [], temp_1: 0, temp_2: 0, evolution: '0' },
        data5: { data: [] },
        data6: { data: [], total: 0, evolution: '0' },
        data7: { data: [], total: 0, evolution: '0' },
        data8: { data: [], total: 0, evolution: '0' },
        data9: { data: [], total: 0, evolution: '0' },
      },
    );

    return {
      data: { data1, data2, data3, data4, data5, data6, data7 },
      columns: this.getColumns(),
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
        dataIndex: 'period_f',
        align: 'center',
      },
      {
        title: 'Turnover\n(VAT excluded)',
        width: 100,
        dataIndex: 'turnover_f',
        align: 'right',
      },
      {
        title: 'Quantity',
        width: 100,
        dataIndex: 'orders_count_f',
        align: 'right',
      },
      {
        title: 'AdSpend',
        width: 100,
        dataIndex: 'ad_spend_f',
        align: 'right',
      },
      {
        title: 'ROAS',
        width: 100,
        dataIndex: 'roas_f',
        align: 'right',
      },
      {
        title: 'CPA',
        width: 100,
        dataIndex: 'cpa_f',
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
