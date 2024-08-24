import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { CustomerController } from './customer/customer.controller';
import { CustomerModule } from './customer/customer.module';
import { CustomerService } from './customer/customer.service';

@Module({
  imports: [CustomerModule, AccessModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerManagementModule {}
