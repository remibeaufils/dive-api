import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  constructor(
    private readonly shopifyService: ShopifyService,
    @InjectConnection() private connection: Connection,
  ) {}

  @Get()
  async getOrders(): Promise<string> {
    let results = null;

    try {
      results = await this.shopifyService.findAll();
      // results = await this.shopifyService.create({
      //   created_at: new Date(),
      //   currency: 'test',
      // });

      // results = await this.connection
      //   .useDb('r_pur')
      //   .collection('shopify-orders')
      //   .find()
      //   .limit(2)
      //   .toArray();
    } catch (error) {
      console.log(error);
    } finally {
      return results;
    }
  }
}
