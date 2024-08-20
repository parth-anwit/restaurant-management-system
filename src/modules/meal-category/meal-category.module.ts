import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessModule } from '../access/access.module';
import { MealCategory, MealCategorySchema } from './meal-category.schema';
import { MealCategoryController } from './meal-category.controller';
import { MealCategoryRepository } from './meal-category.repository';
import { MealCategoryService } from './meal-category.service';
import { MealModule } from '../meal/meal.module';
// import { MealModule } from '../meal/meal.module';
// import { OrderModule } from '../order/order.module';
// import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MealCategory.name, schema: MealCategorySchema }]),
    // forwardRef(() => UserModule),
    // forwardRef(() => AccessModule),
    // forwardRef(() => MealModule),
    // forwardRef(() => OrderModule),
    AccessModule,
    MealModule,
  ],
  providers: [MealCategoryService, MealCategoryRepository],
  controllers: [MealCategoryController],
  exports: [MealCategoryService, MealCategoryRepository],
})
export class MealCategoryModule {}
