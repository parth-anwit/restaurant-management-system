import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';

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
  async getMealList(@Headers('restaurant_id') restaurantId: string, @Query('page') page: string, @Query('pageSize') pageSize: string) {
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 20;
    const meal = await this.mealRepository.getList(restaurantId, pageNum, pageSizeNum);

    return {
      success: true,
      meal: {
        metaData: {
          totalCount: meal.totalCount,
          page: pageNum,
          pageSize: pageSizeNum,
        },
        data: meal.mealListData,
      },
    };
  }

  @Get()
  async getMeal(@Headers('restaurant_id') restaurantId: string) {
    const meal = await this.mealRepository.get(restaurantId);
    return meal;
  }
}
