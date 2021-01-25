import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { differenceInCalendarDays } from 'date-fns';
import { Model } from 'mongoose';
import {
  LineItem,
  LineItemDocument,
} from 'src/shopify/schemas/line-item.schema';

@Injectable()
export class ContextService {
  private monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  });

  private dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Paris',
    // timeZoneName: 'short',
  });

  private currencyFormatter = new Intl.NumberFormat('en-US', {
    currency: 'EUR',
    // @ts-ignore https://github.com/microsoft/TypeScript/pull/40709
    // notation: 'compact',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    style: 'currency',
  });

  private numberFormatter = new Intl.NumberFormat('fr-FR');

  constructor(
    @InjectModel(LineItem.name) private lineItemModel: Model<LineItemDocument>,
  ) {}

  async dashboard(dayFrom = null, dayTo = null): Promise<any> {
    const intervalInDays = differenceInCalendarDays(dayTo, dayFrom);

    const _id =
      intervalInDays > 90
        ? this.groupByMonth()
        : intervalInDays > 14
        ? this.groupByWeek()
        : this.groupByDay();

    let lines = await this.lineItemModel
      .aggregate([
        { $match: { 'created_at.date': { $gte: dayFrom, $lte: dayTo } } },
        {
          $group: {
            _id,
            turnover: { $sum: '$turnover' },
            quantity: { $sum: '$quantity' },
            profit: { $sum: '$profit' },
            order_ids: { $addToSet: '$order_id' },
          },
        },
        {
          $project: {
            _id: 1,
            turnover: 1,
            quantity: 1,
            profit: 1,
            profit_per_unit: { $divide: ['$profit', '$quantity'] },
            orders_count: { $size: '$order_ids' },
            orders_avg_value: {
              $divide: ['$turnover', { $size: '$order_ids' }],
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

    lines = lines.map((line) => {
      return {
        ...line,
        periodF:
          line._id.period_type === 'month'
            ? this.monthFormatter.format(line._id.period_start)
            : line._id.period_type === 'week'
            ? `Week of ${this.dateFormatter
                .format(line._id.period_start)
                .replace(/,/g, '')}`
            : this.dateFormatter.format(line._id.period_start),
        turnoverF: this.currencyFormatter.format(line.turnover),
        profitF: this.currencyFormatter.format(line.profit),
        profitPerUnitF: this.currencyFormatter.format(line.profit_per_unit),
        quantityF: this.numberFormatter.format(line.quantity),
      };
    });

    const columns = [
      {
        title: 'Period',
        width: 300,
        // dataIndex: ['_id', 'period_start'],
        dataIndex: 'periodF',
        align: 'center',
      },
      {
        title: 'Turnover (VAT excluded)',
        width: 100,
        dataIndex: 'turnoverF',
        align: 'right',
      },
      {
        title: 'Quantity',
        width: 100,
        dataIndex: 'quantityF',
        align: 'right',
      },
      {
        title: 'AdSpend',
        width: 100,
        dataIndex: 'adspendGlobal',
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
      {
        title: 'Profit',
        width: 100,
        dataIndex: 'profitF',
        align: 'right',
      },
      {
        title: 'Profit per unit',
        width: 100,
        dataIndex: 'profitPerUnitF',
        align: 'right',
      },
    ];

    return { lines, columns };
  }

  groupByDay() {
    // return {
    //   $dateToString: {
    //     format: '%Y-%m-%dT00:00:00%z',
    //     date: '$created_at.date',
    //     timezone: '$created_at.timezone',
    //   },
    // };

    return {
      period_type: 'day',
      period_start: {
        $dateFromString: {
          dateString: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created_at.date',
              timezone: '$created_at.timezone',
            },
          },
          format: '%Y-%m-%d',
          timezone: '$created_at.timezone',
        },
      },
    };
  }

  groupByWeek() {
    // return {
    //   $dateToString: {
    //     format: '%G %V',
    //     date: '$created_at.date',
    //     timezone: '$created_at.timezone',
    //   },
    // };

    return {
      period_type: 'week',
      period_start: {
        $dateFromString: {
          dateString: {
            $dateToString: {
              format: '%G %V',
              date: '$created_at.date',
              timezone: '$created_at.timezone',
            },
          },
          format: '%G %V',
          timezone: '$created_at.timezone',
        },
      },
    };
  }

  groupByMonth() {
    // return {
    //   $dateToString: {
    //     format: '%Y-%m-01T00:00:00%z',
    //     date: '$created_at.date',
    //     timezone: '$created_at.timezone',
    //   },
    // };

    return {
      period_type: 'month',
      period_start: {
        $dateFromString: {
          dateString: {
            $dateToString: {
              format: '%Y-%m-01',
              date: '$created_at.date',
              timezone: '$created_at.timezone',
            },
          },
          format: '%Y-%m-%d',
          timezone: '$created_at.timezone',
        },
      },
    };
  }
}
