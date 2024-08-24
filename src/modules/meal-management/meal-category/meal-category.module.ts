import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessModule } from '../../access/access.module';
import { MealCategory, MealCategorySchema } from './meal-category.schema';
import { MealCategoryRepository } from './meal-category.repository';
import { MealModule } from '../meal/meal.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: MealCategory.name, schema: MealCategorySchema }]), AccessModule, MealModule],
  providers: [MealCategoryRepository],
  controllers: [],
  exports: [MealCategoryRepository],
})
export class MealCategoryModule {}
