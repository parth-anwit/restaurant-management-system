import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

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

  @HttpCode(200)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Headers('restaurant_id') restaurantId: string, @Body() createDto: CreateMealCategoryDto) {
    const data = await this.service.create(restaurantId, createDto);
    return data;
  }

  @HttpCode(200)
  @Post()
  async get(@Headers('restaurant_id') restaurantId: string) {
    const mealCategory = await this.service.get(restaurantId);
    return mealCategory;
  }

  @HttpCode(200)
  @Get('list')
  async getList(@Headers('restaurant_id') restaurantId: string, @Query('page') page: string, @Query('pageSize') pageSize: string) {
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 20;
    const data = await this.service.getList(restaurantId, pageNum, pageSizeNum);
    return data;
  }

  // get meals on mealCategory

  @HttpCode(200)
  @Get(':mealCategoryId/meal')
  async getMealsOnMealCategory(@Headers('restaurant_id') restaurantId: string, @Param('mealCategoryId') mealCategoryId: string) {
    const findMealCategory = await this.mealCategoryRepo.getSpecific(restaurantId, mealCategoryId);
    if (!findMealCategory) {
      throw new HttpException('meal category not found', 404);
    }
    const data = await this.mealService.getMealsOnMealCategory(restaurantId, mealCategoryId);
    return data;
  }

  @HttpCode(200)
  @Get(':mealCategoryId')
  async getSpecific(@Headers('restaurant_id') restaurantId: string, @Param('mealCategoryId') mealCategoryId: string) {
    const data = await this.service.getSpecific(restaurantId, mealCategoryId);
    return data;
  }

  @HttpCode(200)
  @Patch(':mealCategoryId')
  @UsePipes(new ValidationPipe())
  async update(
    @Headers('restaurant_id') restaurantId: string,
    @Param('mealCategoryId') mealCategoryId: string,
    @Body() updateMealCategory: UpdateMealCategoryDto,
  ) {
    const data = await this.service.update(restaurantId, mealCategoryId, updateMealCategory);
    return data;
  }

  @HttpCode(200)
  @Delete(':mealCategoryId')
  async delete(@Headers('restaurant_id') restaurantId: string, @Param('mealCategoryId') mealCategoryId: string) {
    const data = await this.service.delete(restaurantId, mealCategoryId);
    return data;
  }
}
