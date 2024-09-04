import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { BillController } from './bill/bill.controller';
import { BillModule } from './bill/bill.module';
import { BillService } from './bill/bill.service';
import { CustomerManagementModule } from '../customer-management/customer-management.module';
import { CustomerModule } from '../customer-management/customer/customer.module';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';

@Module({
  imports: [OrderModule, BillModule, AccessModule, CustomerModule, CustomerManagementModule],
  controllers: [OrderController, BillController],
  providers: [OrderService, BillService],
  exports: [BillService, OrderService],
})
export class OrderManagementModule {}
