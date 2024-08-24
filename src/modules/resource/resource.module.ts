import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { BillModule } from '../order-management/bill/bill.module';
import { CustomerModule } from '../customer-management/customer/customer.module';
import { MealCategoryModule } from '../meal-management/meal-category/meal-category.module';
import { MealModule } from '../meal-management/meal/meal.module';
import { OrderModule } from '../order-management/order/order.module';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CustomerModule, OrderModule, BillModule, RestaurantModule, UserModule, AccessModule, MealModule, MealCategoryModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
