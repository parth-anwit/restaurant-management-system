import { Module } from '@nestjs/common';

import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
