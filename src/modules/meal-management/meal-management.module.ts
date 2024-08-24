import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { MealCategoryController } from './meal-category/meal-category.controller';
import { MealCategoryModule } from './meal-category/meal-category.module';
import { MealCategoryService } from './meal-category/meal-category.service';
import { MealController } from './meal/meal.controller';
import { MealModule } from './meal/meal.module';
import { MealService } from './meal/meal.service';

@Module({
  imports: [MealModule, MealCategoryModule, AccessModule],
  controllers: [MealController, MealCategoryController],
  providers: [MealService, MealCategoryService],
  exports: [MealService],
})
export class MealManagementModule {}
