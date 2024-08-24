import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BillModule } from '../../order-management/bill/bill.module';
import { Customer, CustomerSchema } from './customer.schema';

import { AccessModule } from '../../access/access.module';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]), AccessModule, BillModule],
  providers: [CustomerRepository],
  controllers: [],
  exports: [CustomerRepository],
})
export class CustomerModule {}
