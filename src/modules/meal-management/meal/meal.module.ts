import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessModule } from '../../access/access.module';

import { Meal, mealSchema } from './meal.schema';

import { MealControllerOptional } from './meal2.controller';

import { MealRepository } from './meal.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Meal.name, schema: mealSchema }]), AccessModule],
  providers: [MealRepository],
  controllers: [MealControllerOptional],
  exports: [MealRepository],
})
export class MealModule {}
