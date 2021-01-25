import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get()
  async getOrders(): Promise<string> {
    let results = null;

    try {
      results = await this.shopifyService.findAll();
    } catch (error) {
      console.log(error);
    } finally {
      return results;
    }
  }
}
