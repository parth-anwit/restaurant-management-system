import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

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

  @Get(':orderId/specific')
  async getSpecific(@Headers('restaurant_id') restaurantId: string, @Param('orderId') orderId: string) {
    const data = await this.orderService.getSpecific(restaurantId, orderId);
    return data;
  }

  @Patch(':orderId')
  async update(@Headers('restaurant_id') restaurantId: string, @Param('orderId') orderId: string, @Body() updateOrderDto: UpdateOrderDto) {
    const data = await this.orderService.update(restaurantId, orderId, updateOrderDto);
    return data;
  }

  @Delete(':orderId')
  async delete(@Headers('restaurant_id') restaurantId: string, @Param('orderId') orderId: string) {
    const data = await this.orderService.delete(restaurantId, orderId);
    return data;
  }

  @Get('specific-customer')
  async getAllOrdersOfSpecificCustomer(@Headers('restaurant_id') restaurantId: string, @Param('customerId') customerId: string) {
    const data = await this.orderService.getOrderOfSpecificCustomer(restaurantId, customerId);
    return data;
  }

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

  @Delete(':orderId/specific-customer')
  async deleteSpecificOrderOfSpecificCustomer(
    @Headers('restaurant_id') restaurantId: string,
    @Param('customerId') customerId: string,
    @Param('orderId') orderId: string,
  ) {
    const data = await this.orderService.deleteSpecificOrderOfSpecificCustomer(restaurantId, customerId, orderId);
    return data;
  }
}
