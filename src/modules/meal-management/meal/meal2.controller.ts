import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import mongoose from 'mongoose';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';
import { MealRepository } from './meal.repository';
import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

@Controller('meal')
@ApiTags('Meal2')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class MealControllerOptional {
  constructor(private mealRepository: MealRepository) {}

  @Get('list')
  async getMealList(@Headers('restaurant_id') restaurant_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.mealRepository.get(restaurantId);
    return data;
  }
}
