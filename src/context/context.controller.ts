import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ContextService } from './context.service';

@Controller('context')
export class ContextController {
  constructor(private readonly contextService: ContextService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Request() req): string {
    const { from, to } = req.query;

    const monthFrom = from ? startOfMonth(parseISO(from)) : null;
    const monthTo = to ? endOfMonth(parseISO(to)) : null;

    return this.contextService.dashboard(monthFrom, monthTo);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-sdui')
  getDashboardSDUI(@Request() req): string {
    // async getDashboardSDUI(@Request() req) {
    const { from, to } = req.query;

    const monthFrom = from ? startOfMonth(parseISO(from)) : null;
    const monthTo = to ? endOfMonth(parseISO(to)) : null;

    // await new Promise((resolve) => setTimeout(() => resolve(), 1500));
    return this.contextService.dashboardSDUI(monthFrom, monthTo);
  }
}
