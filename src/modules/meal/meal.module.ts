import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessModule } from '../access/access.module';

import { Meal, mealSchema } from './meal.schema';

import { MealController } from './meal.controller';
import { MealRepository } from './meal.repository';
import { MealService } from './meal.service';

// import { OrderModule } from 'src/order/order.module';

// import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: mealSchema }]),
    // forwardRef(() => UserModule),
    // forwardRef(() => AccessModule),
    // forwardRef(() => OrderModule),
    AccessModule,
  ],
  providers: [MealService, MealRepository],
  controllers: [MealController],
  exports: [MealService, MealRepository],
})
export class MealModule {}
