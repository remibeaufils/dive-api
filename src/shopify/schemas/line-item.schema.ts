import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LineItemDocument = LineItem & Document;

@Schema({ collection: 'shopify-order-line-item' })
export class LineItem {
  @Prop()
  order_id: string;

  @Prop()
  store_id: string;

  @Prop()
  variant_id: string;

  @Prop()
  product_id: string;

  @Prop()
  currency: string;

  @Prop()
  profit: number;

  @Prop()
  profit_per_unit: number;

  @Prop()
  quantity: number;

  @Prop()
  turnover: number;
}

export const LineItemSchema = SchemaFactory.createForClass(LineItem);

// LineItemSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.detail;
//   return obj;
// };
