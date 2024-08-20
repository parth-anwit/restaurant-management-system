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
import { Types } from 'mongoose';

import { CreateMealCategoryDto } from './dtos/create.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { MealCategoryService } from './meal-category.service';
import { MealRepository } from '../meal/meal.repository';
import { UpdateMealCategoryDto } from './dtos/update.dto';
import { ValidRestaurantGuard } from '../auth/guards/valid-restaurant.guard';

@Controller('mealCategory')
@ApiTags('Meal Category')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class MealCategoryController {
  constructor(
    private service: MealCategoryService,
    private mealRepo: MealRepository,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Headers() header: any, @Body() createDto: CreateMealCategoryDto) {
    const restaurantId = header.restaurant_id;
    const data = await this.service.create(restaurantId, createDto);
    return data;
  }

  @Get()
  async get() {
    const data = await this.service.get();
    return data;
  }

  @Get(':id')
  async getSpecific(@Param('id') id: string) {
    const data = await this.service.getSpecific(id);
    return data;
  }

  @Get(':id/meal')
  async getAllMeal(@Param('id') id: Types.ObjectId) {
    const data = await this.mealRepo.getAllMeal(id);
    if (data.length === 0) {
      throw new HttpException('meal category not found', 404);
    }
    return data;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMealCategory: UpdateMealCategoryDto) {
    const data = await this.service.update(id, updateMealCategory);
    return data;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return data;
  }
}
