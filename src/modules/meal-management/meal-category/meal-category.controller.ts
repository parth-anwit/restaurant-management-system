import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import mongoose from 'mongoose';

import { CreateMealCategoryDto } from './dtos/create.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';
import { MealCategoryRepository } from './meal-category.repository';
import { MealCategoryService } from './meal-category.service';
import { MealService } from '../meal/meal.service';
import { UpdateMealCategoryDto } from './dtos/update.dto';
import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

@Controller('meal-category')
@ApiTags('Meal_category')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class MealCategoryController {
  constructor(
    private service: MealCategoryService,
    private mealService: MealService,
    private mealCategoryRepo: MealCategoryRepository,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Headers('restaurant_id') restaurant_id: string, @Body() createDto: CreateMealCategoryDto) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.service.create(restaurantId, createDto);
    return data;
  }

  @Get('list')
  async get(@Headers('restaurant_id') restaurant_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.service.get(restaurantId);
    return data;
  }

  // get meals on mealCategory

  @Get(':id/meal')
  async getMealsOnMealCategory(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const findMealCategory = await this.mealCategoryRepo.getSpecific(restaurantId, id);
    if (!findMealCategory) {
      throw new HttpException('meal category not found', 404);
    }
    const data = await this.mealService.getMealsOnMealCategory(restaurantId, id);
    return data;
  }

  @Get(':id')
  async getSpecific(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.service.getSpecific(restaurantId, id);
    return data;
  }

  @Patch(':id')
  async update(
    @Headers('restaurant_id') restaurant_id: string,
    @Param('id') id: string,
    @Body() updateMealCategory: UpdateMealCategoryDto,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.service.update(restaurantId, id, updateMealCategory);
    return data;
  }

  @Delete(':id')
  async delete(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.service.delete(restaurantId, id);
    return data;
  }
}
