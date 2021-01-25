import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LineItemDocument } from 'src/shopify/schemas/line-item.schema';
import { StoresService } from 'src/stores/stores.service';
import { ContextService } from './context.service';

@Controller('context')
export class ContextController {
  private DEFAULT_DAY_FROM = new Date(2016, 0, 1);
  private DEFAULT_DAY_TO = new Date();

  constructor(
    private readonly contextService: ContextService,
    private readonly storesService: StoresService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboard(@Request() req): Promise<LineItemDocument> {
    const { from, to } = req.query;

    const dayFrom = from ? parseISO(from) : this.DEFAULT_DAY_FROM;
    const dayTo = to ? parseISO(to) : this.DEFAULT_DAY_TO;

    // console.log(dayFrom, dayTo);

    const data = await this.contextService.dashboard(dayFrom, dayTo);

    const store = await this.storesService.findOne('r-pur');

    const { currency, iana_timezone: timezone } = store.sources.find(
      ({ name }) => name === 'shopify',
    ).shop;

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
