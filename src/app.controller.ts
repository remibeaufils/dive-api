import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async getHello(): Promise<string> {
    // return '1';
    // return bcrypt.hash('239$gk*)84', 10);

    return this.appService.getHello();
  }
}
