import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LineItem, LineItemSchema } from './schemas/line-item.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { ShopifyController } from './shopify.controller';
import { ShopifyService } from './shopify.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LineItem.name, schema: LineItemSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ShopifyController],
  providers: [ShopifyService],
  exports: [MongooseModule],
})
export class ShopifyModule {}
