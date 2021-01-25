import { Module } from '@nestjs/common';
import { ShopifyModule } from 'src/shopify/shopify.module';
import { StoresModule } from 'src/stores/stores.module';
import { ContextController } from './context.controller';
import { ContextService } from './context.service';

@Module({
  imports: [ShopifyModule, StoresModule],
  controllers: [ContextController],
  providers: [ContextService],
})
export class ContextModule {}
