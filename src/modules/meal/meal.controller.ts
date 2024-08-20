import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';

import { CreateMealDto } from './dtos/create.dto';
import { MealService } from './meal.service';
import { UpdateMealDto } from './dtos/update.dto';
import { ValidRestaurantGuard } from '../auth/guards/valid-restaurant.guard';

@Controller('meal')
@ApiTags('Meal')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class MealController {
  constructor(private mealService: MealService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Headers() header: any, @Body() createDto: CreateMealDto) {
    const restaurantId = header.restaurant_id;

    const data = await this.mealService.create(restaurantId, createDto);
    return data;
  }

  @Get()
  async get() {
    const data = await this.mealService.get();
    return data;
  }

  @Get(':id')
  async getSpecific(@Param('id') id: Types.ObjectId) {
    const data = await this.mealService.getSpecific(id);
    return data;
  }

  @Patch(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() updateMealDto: UpdateMealDto, @Headers() header: any) {
    const { restaurant_id } = header;

    const data = await this.mealService.update(id, updateMealDto, restaurant_id);
    return data;
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    const data = await this.mealService.delete(id);
    return data;
  }
}
