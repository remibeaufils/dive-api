import { Module } from '@nestjs/common';
import { ContextController } from './context.controller';
import { ContextService } from './context.service';

@Module({
  controllers: [ContextController],
  providers: [ContextService],
})
export class ContextModule {}
