import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import mongoose from 'mongoose';

import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';

import { CreateCustomerDto } from './dtos/create.dto';

import { CustomerService } from './customer.service';

import { UpdateCustomerDto } from './dtos/update.dto';

@Controller('customer')
@ApiTags('Customer')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Headers('restaurant_id') restaurant_id: string, @Body() createDto: CreateCustomerDto) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.customerService.create(restaurantId, createDto);
    return data;
  }

  @Get('list')
  async get(@Headers('restaurant_id') restaurant_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.customerService.get(restaurantId);
    return data;
  }

  @Get(':id')
  async getSpecific(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.customerService.getSpecific(restaurantId, id);
    return data;
  }

  @Patch(':id')
  async update(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.customerService.update(restaurantId, id, updateCustomerDto);
    return data;
  }

  @Delete(':id')
  async delete(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.customerService.delete(restaurantId, id);
    return data;
  }
}
