import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessModule } from '../access/access.module';

import { BillModule } from '../order-management/bill/bill.module';
import { CustomerModule } from '../customer-management/customer/customer.module';
import { MealCategoryModule } from '../meal-management/meal-category/meal-category.module';
import { MealModule } from '../meal-management/meal/meal.module';
import { OrderModule } from '../order-management/order/order.module';
import { Restaurant, RestaurantSchema } from './restaurant.schema';
import { RestaurantController } from './restaurant.controller';
import { RestaurantRepository } from './restaurant.repository';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }]),
    AccessModule,
    MealCategoryModule,
    MealModule,
    CustomerModule,
    BillModule,
    OrderModule,
  ],
  providers: [RestaurantService, RestaurantRepository],
  controllers: [RestaurantController],
  exports: [RestaurantService, RestaurantRepository],
})
export class RestaurantModule {}
