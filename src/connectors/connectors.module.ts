import { HttpModule, Module } from '@nestjs/common';
import { ConnectorsController } from './connectors.controller';
import { Connector, ConnectorSchema } from './schemas/connector.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreConfigModule } from 'src/store-config/store-config.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Connector.name, schema: ConnectorSchema },
    ]),
    StoreConfigModule,
  ],
  controllers: [ConnectorsController],
})
export class ConnectorsModule {}
