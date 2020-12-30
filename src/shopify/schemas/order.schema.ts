import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ collection: 'shopify-orders' })
export class Order {
  @Prop()
  id: number;

  @Prop()
  created_at: Date;

  @Prop()
  currency: string;

  @Prop()
  email: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
