import { Module } from '@nestjs/common';

import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  providers: [BillService],
  controllers: [BillController],
})
export class BillModule {}
