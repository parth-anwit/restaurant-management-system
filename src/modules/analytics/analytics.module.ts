import { Module } from '@nestjs/common';

import { AnalyticsController } from './analytics.controller';
import { OrderManagementModule } from '../order-management/order-management.module';

@Module({
  imports: [OrderManagementModule],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
