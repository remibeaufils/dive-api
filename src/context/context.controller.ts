import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { endOfDay, parseISO } from 'date-fns';
import { toDate, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { LineItemDocument } from 'src/shopify/schemas/line-item.schema';
import { StoresService } from 'src/stores/stores.service';
import { ContextService } from './context.service';

@Controller('context')
export class ContextController {
  constructor(
    private readonly contextService: ContextService,
    private readonly storesService: StoresService,
  ) {}

  @Public()
  @Get('ranges')
  async getRanges(): Promise<any> {
    return this.contextService.test_ranges();
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Request() req): Promise<LineItemDocument> {
    const store = await this.storesService.findOne('r-pur');

    const { currency, iana_timezone: timezone } = store.sources.find(
      ({ name }) => name === 'shopify',
    ).shop;

    const DEFAULT_DAY_FROM = toDate('2016-01-01', {
      timeZone: timezone,
    });

    const now = new Date();

    let DEFAULT_DAY_TO = utcToZonedTime(now, timezone);
    DEFAULT_DAY_TO = endOfDay(DEFAULT_DAY_TO);
    DEFAULT_DAY_TO = zonedTimeToUtc(DEFAULT_DAY_TO, timezone);

    const from = req.query.from ? parseISO(req.query.from) : DEFAULT_DAY_FROM;
    const to = req.query.to ? parseISO(req.query.to) : DEFAULT_DAY_TO;

    // console.log(from, to);

    const data = await this.contextService.dashboard('r-pur', from, to);

    return { ...data, currency, timezone };
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('dashboard-sdui')
  // getDashboardSDUI(@Request() req): string {
  //   // async getDashboardSDUI(@Request() req) {
  //   const { from, to } = req.query;

  //   const monthFrom = from ? startOfMonth(parseISO(from)) : null;
  //   const monthTo = to ? endOfMonth(parseISO(to)) : null;

  //   // await new Promise((resolve) => setTimeout(() => resolve(), 1500));
  //   return this.contextService.dashboardSDUI(monthFrom, monthTo);
  // }
}
