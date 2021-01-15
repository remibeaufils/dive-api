import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConnectorDocument = Connector & Document;

@Schema()
export class Connector {
  @Prop()
  id: string;

  @Prop()
  token: string;

  @Prop()
  user: { name: string; id: string };
}

export const ConnectorSchema = SchemaFactory.createForClass(Connector);
