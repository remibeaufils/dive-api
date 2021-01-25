import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Connector } from 'src/connectors/schemas/connector.schema';

export type StoreConfigDocument = StoreConfig & Document;

@Schema()
export class StoreConfig {
  @Prop()
  id: string;

  @Prop()
  merchantId: string;

  @Prop()
  connectors: Connector[];
}

export const StoreConfigSchema = SchemaFactory.createForClass(StoreConfig);
