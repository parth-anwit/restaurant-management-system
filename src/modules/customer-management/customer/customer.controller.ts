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

import { CreateCustomerDto } from './dtos/create.dto';

import { CustomerService } from './customer.service';

import { UpdateCustomerDto } from './dtos/update.dto';

@Controller('customer')
@ApiTags('Customer')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @HttpCode(200)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Headers('restaurant_id') restaurantId: string, @Body() createDto: CreateCustomerDto) {
    const data = await this.customerService.create(restaurantId, createDto);
    return data;
  }

  @HttpCode(200)
  @Get()
  async get(@Headers('restaurant_id') restaurantId: string) {
    const customer = await this.customerService.get(restaurantId);
    return customer;
  }

  @HttpCode(200)
  @Get('list')
  async getList(@Headers('restaurant_id') restaurantId: string, @Query('page') page: string, @Query('pageSize') pageSize: string) {
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 20;

    const data = await this.customerService.getList(restaurantId, pageNum, pageSizeNum);
    return data;
  }

  @HttpCode(200)
  @Get(':customerId')
  async getSpecific(@Headers('restaurant_id') restaurantId: string, @Param('customerId') customerId: string) {
    const data = await this.customerService.getSpecific(restaurantId, customerId);
    return data;
  }

  @HttpCode(200)
  @Patch(':customerId')
  async update(
    @Headers('restaurant_id') restaurantId: string,
    @Param('customerId') customerId: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const data = await this.customerService.update(restaurantId, customerId, updateCustomerDto);
    return data;
  }

  @HttpCode(200)
  @Delete(':customerId')
  async delete(@Headers('restaurant_id') restaurantId: string, @Param('customerId') customerId: string) {
    const data = await this.customerService.delete(restaurantId, customerId);
    return data;
  }
}
