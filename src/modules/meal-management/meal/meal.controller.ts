import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import mongoose from 'mongoose';

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

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Headers('restaurant_id') restaurantId: string,
    @Body() createDto: CreateMealDto,
    @Param('mealCategoryId') mealCategoryId: string,
  ) {
    const data = await this.mealService.create(restaurantId, createDto, mealCategoryId);
    return data;
  }

  @Get(':id')
  async getSpecific(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.mealService.getSpecific(restaurantId, id);
    return data;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
    @Headers('restaurant_id') restaurant_id: string,
    @Param('mealCategoryId') mealCategoryId: string,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.mealService.update(id, updateMealDto, restaurantId, mealCategoryId);
    return data;
  }

  @Delete(':id')
  async delete(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.mealService.delete(restaurantId, id);
    return data;
  }
}
