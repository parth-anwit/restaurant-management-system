import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';

import { CreateMealDto } from './dtos/create.dto';
import { MealService } from './meal.service';
import { UpdateMealDto } from './dtos/update.dto';
import { ValidMealCategoryGuard } from '../../auth/guards/valid-mealCategory.guard';
import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

@Controller('mealCategory/:mealCategoryId/meal')
@ApiTags('Meal')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard, ValidMealCategoryGuard)
export class MealController {
  constructor(private mealService: MealService) {}

  @HttpCode(200)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Headers('restaurant_id') restaurantId: string,
    @Param('mealCategoryId') mealCategoryId: string,
    @Body() createDto: CreateMealDto,
  ) {
    const data = await this.mealService.create(restaurantId, mealCategoryId, createDto);
    return data;
  }

  @HttpCode(200)
  @Get(':mealId')
  async getSpecific(@Headers('restaurant_id') restaurantId: string, @Param('mealId') mealId: string) {
    const data = await this.mealService.getSpecific(restaurantId, mealId);
    return data;
  }

  @HttpCode(200)
  @Patch(':mealId')
  @UsePipes(new ValidationPipe())
  async update(
    @Headers('restaurant_id') restaurantId: string,
    @Param('mealCategoryId') mealCategoryId: string,
    @Param('mealId') mealId: string,
    @Body() updateMealDto: UpdateMealDto,
  ) {
    const data = await this.mealService.update(restaurantId, mealCategoryId, mealId, updateMealDto);
    return data;
  }

  @HttpCode(200)
  @Delete(':mealId')
  async delete(@Headers('restaurant_id') restaurantId: string, @Param('mealId') mealId: string) {
    const data = await this.mealService.delete(restaurantId, mealId);
    return data;
  }
}
