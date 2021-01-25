import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema({ collection: 'stores' })
export class Store {
  @Prop()
  id: string;

  @Prop()
  merchant_id: string;

  @Prop()
  sources: any[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
