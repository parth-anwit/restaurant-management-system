import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';

import { CreateOrderDto } from './dtos/create.dto';

import { UpdateOrderDto } from './dtos/update.dto';

import { OrderService } from './order.service';
import { ValidBillGuard } from '../../auth/guards/valid-bill.guard';
import { ValidCustomerGuard } from '../../auth/guards/valid-customer.guard';

@Controller('customer/:customerId/bill/:billId/order')
@ApiTags('Order')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard, ValidCustomerGuard, ValidBillGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @HttpCode(200)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createDto: CreateOrderDto,
    @Headers('restaurant_id') restaurantId: string,
    @Param('customerId') customerId: string,
    @Param('billId') billId: string,
  ) {
    const data = await this.orderService.create(restaurantId, customerId, billId, createDto);
    return data;
  }

  @HttpCode(200)
  @Get('list')
  async getOrderList(@Headers('restaurant_id') restaurantId: string, @Query('page') page: string, @Query('pageSize') pageSize: string) {
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 20;

    const order = await this.orderService.getOrderList(restaurantId, pageNum, pageSizeNum);
    return order;
  }

  @HttpCode(200)
  @Get(':orderId/specific')
  async getSpecific(@Headers('restaurant_id') restaurantId: string, @Param('orderId') orderId: string) {
    const data = await this.orderService.getSpecific(restaurantId, orderId);
    return data;
  }

  @HttpCode(200)
  @Patch(':orderId')
  async update(@Headers('restaurant_id') restaurantId: string, @Param('orderId') orderId: string, @Body() updateOrderDto: UpdateOrderDto) {
    const data = await this.orderService.update(restaurantId, orderId, updateOrderDto);
    return data;
  }

  @HttpCode(200)
  @Delete(':orderId')
  async delete(@Headers('restaurant_id') restaurantId: string, @Param('orderId') orderId: string) {
    const data = await this.orderService.delete(restaurantId, orderId);
    return data;
  }

  @HttpCode(200)
  @Get('specific-customer')
  async getAllOrdersOfSpecificCustomer(@Headers('restaurant_id') restaurantId: string, @Param('customerId') customerId: string) {
    const data = await this.orderService.getOrderOfSpecificCustomer(restaurantId, customerId);
    return data;
  }

  @HttpCode(200)
  @Patch(':orderId/specific-customer')
  async updateSpecificOrderOfSpecificCustomer(
    @Headers('restaurant_id') restaurantId: string,
    @Param('customerId') customerId: string,
    @Param('orderId') orderId: string,
    @Body() updateDto: UpdateOrderDto,
  ) {
    const data = await this.orderService.updateSpecificOrderOfSpecificCustomer(restaurantId, customerId, orderId, updateDto);
    return data;
  }

  @HttpCode(200)
  @Delete(':orderId/specific-customer')
  async deleteSpecificOrderOfSpecificCustomer(
    @Headers('restaurant_id') restaurantId: string,
    @Param('customerId') customerId: string,
    @Param('orderId') orderId: string,
  ) {
    const data = await this.orderService.deleteSpecificOrderOfSpecificCustomer(restaurantId, customerId, orderId);
    return data;
  }

  @HttpCode(200)
  @Get('/popular-meal-mealCategory')
  async findPopularMeal(@Query('month') month: string) {
    const monthNum = parseInt(month, 10) || 1;
    const bill = await this.orderService.findPopular_Meal_MealCategory(monthNum);
    return bill;
  }
}
