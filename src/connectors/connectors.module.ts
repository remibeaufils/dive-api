import { HttpModule, Module } from '@nestjs/common';
import { ConnectorsController } from './connectors.controller';
import { Connector, ConnectorSchema } from './schemas/connector.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Connector.name, schema: ConnectorSchema },
    ]),
    StoresModule,
  ],
  controllers: [ConnectorsController],
})
export class ConnectorsModule {}
