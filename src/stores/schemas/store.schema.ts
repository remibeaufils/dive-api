import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Connector } from 'src/connectors/schemas/connector.schema';

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop()
  id: string;

  @Prop()
  merchantId: string;

  @Prop()
  connectors: Connector[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
