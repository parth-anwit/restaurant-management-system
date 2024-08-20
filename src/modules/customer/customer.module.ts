import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Customer, CustomerSchema } from './customer.schema';

// import { UserModule } from 'src/users/users.module';
import { AccessModule } from '../access/access.module';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
// import { BillModule } from 'src/bill/bill.module';
// import { OrderModule } from 'src/order/order.module';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    // forwardRef(() => UserModule),
    forwardRef(() => AccessModule),
    // forwardRef(() => OrderModule),
    // forwardRef(() => BillModule),
  ],
  providers: [CustomerService, CustomerRepository],
  controllers: [CustomerController],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
