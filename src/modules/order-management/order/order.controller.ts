import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import mongoose from 'mongoose';

import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';

import { CreateOrderDto } from './dtos/create.dto';

import { UpdateOrderDto } from './dtos/update.dto';

import { OrderService } from './order.service';
import { ValidBillGuard } from '../../auth/guards/valid-bill.guard';
import { ValidCustomerGuard } from '../../auth/guards/valid-customer.guard';

@Controller('customer/:customer_id/bill/:bill_id/order')
@ApiTags('Order')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard, ValidCustomerGuard, ValidBillGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Headers('restaurant_id') restaurant_id: string,
    @Body() createDto: CreateOrderDto,
    @Param('customer_id') customer_id: string,
    @Param('bill_id') bill_id: string,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);

    const data = await this.orderService.create(createDto, restaurantId, customer_id, bill_id);
    return data;
  }

  @Get(':id/specific')
  async getSpecific(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.orderService.getSpecific(restaurantId, id);
    return data;
  }

  @Patch(':id')
  async update(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.orderService.update(restaurantId, id, updateOrderDto);
    return data;
  }

  @Delete(':id')
  async delete(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.orderService.delete(restaurantId, id);
    return data;
  }

  @Get('specific-customer')
  async getAllOrdersOfSpecificCustomer(@Headers('restaurant_id') restaurant_id: string, @Param('customer_id') customer_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.orderService.getOrderOfSpecificCustomer(restaurantId, customer_id);
    return data;
  }

  @Patch(':order_id/specific-customer')
  async updateSpecificOrderOfSpecificCustomer(
    @Headers('restaurant_id') restaurant_id: string,
    @Param('customer_id') customer_id: string,
    @Param('order_id') order_id: string,
    @Body() updateDto: UpdateOrderDto,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.orderService.updateSpecificOrderOfSpecificCustomer(restaurantId, customer_id, order_id, updateDto);
    return data;
  }

  @Delete(':order_id/specific-customer')
  async deleteSpecificOrderOfSpecificCustomer(
    @Headers('restaurant_id') restaurant_id: string,
    @Param('customer_id') customer_id: string,
    @Param('order_id') order_id: string,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.orderService.deleteSpecificOrderOfSpecificCustomer(restaurantId, customer_id, order_id);
    return data;
  }
}
