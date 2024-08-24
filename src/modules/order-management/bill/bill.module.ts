import { MongooseModule } from '@nestjs/mongoose';

import { Module } from '@nestjs/common';

import { MealManagementModule } from '../../meal-management/meal-management.module';

import { AccessModule } from '../../access/access.module';
import { UserModule } from '../../user/user.module';

import { Bill, BillSchema } from './bill.schema';

import { All_Bill_Controller } from './bill2.controller';
import { BillRepository } from './bill.repository';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    UserModule,
    AccessModule,
    OrderModule,
    MealManagementModule,
  ],
  providers: [BillRepository],
  controllers: [All_Bill_Controller],
  exports: [BillRepository],
})
export class BillModule {}
