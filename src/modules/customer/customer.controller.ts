import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { Types } from 'mongoose';
import { ValidRestaurantGuard } from '../auth/guards/valid-restaurant.guard';

import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';

import { CreateCustomerDto } from './dtos/create.dto';

import { CustomerService } from './customer.service';

import { UpdateCustomerDto } from './dtos/update.dto';

// import { BillService } from 'src/bill/bill.service';

@Controller('customer')
@ApiTags('Customer')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    // private billService: BillService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Headers() header: any, @Body() createDto: CreateCustomerDto) {
    const restaurantId = header.restaurant_id;
    const data = await this.customerService.create(createDto, restaurantId);
    return data;
  }

  @Get()
  async get() {
    const data = await this.customerService.get();
    return data;
  }

  @Get(':id')
  async getSpecific(@Param('id') id: Types.ObjectId) {
    const data = await this.customerService.getSpecific(id);
    return data;
  }

  @Patch(':id')
  async update(@Param('id') id: Types.ObjectId, @Body() updateCustomerDto: UpdateCustomerDto) {
    const data = await this.customerService.update(id, updateCustomerDto);
    return data;
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    const data = await this.customerService.delete(id);
    return data;
  }
}
