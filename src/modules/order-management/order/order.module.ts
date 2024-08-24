import { MongooseModule } from '@nestjs/mongoose';

import { Module } from '@nestjs/common';

import { AccessModule } from '../../access/access.module';

import { UserModule } from '../../user/user.module';

import { Order, OrderSchema } from './order.schema';

import { OrderRepository } from './order.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), UserModule, AccessModule],
  providers: [OrderRepository],
  controllers: [],
  exports: [OrderRepository],
})
export class OrderModule {}
