import { Body, Controller, Delete, Get, Headers, HttpException, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import mongoose from 'mongoose';

import { CustomerService } from '../../customer-management/customer/customer.service';

import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';

import { BillService } from './bill.service';

import { UpdateBillDto } from './dtos/update.dto';

import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ValidBillGuard } from '../../auth/guards/valid-bill.guard';
import { ValidCustomerGuard } from '../../auth/guards/valid-customer.guard';

@Controller('customer/:customer_id/bill')
@ApiTags('Bill')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard, ValidCustomerGuard)
export class BillController {
  constructor(
    private billService: BillService,
    private customerService: CustomerService,
  ) {}

  @Post('sessionStart')
  async create(@Headers('restaurant_id') restaurant_id: string, @GetUser() user: string, @Param('customer_id') customer_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const validation = await this.billService.validationForAddBill(user);
    if (validation) {
      throw new HttpException('this bill session is already started', 404);
    }
    const data = await this.billService.create(restaurantId, user, customer_id);
    return data;
  }

  @UseGuards(ValidBillGuard)
  @Patch(':bill_id/sessionEnd')
  async put(
    @Headers('restaurant_id') restaurant_id: string,
    @GetUser() user: string,
    @Param('customer_id') customer_id: string,
    @Param('bill_id') bill_id: string,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.endBillSession(restaurantId, user, customer_id, bill_id);
    return data;
  }

  @UseGuards(ValidBillGuard)
  @Patch(':bill_id/generateBill')
  async generateBill(
    @Headers('restaurant_id') restaurant_id: string,
    @GetUser() user: string,
    @Param('customer_id') customer_id: string,
    @Param('bill_id') bill_id: string,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.generateBill(restaurantId, user, customer_id, bill_id);
    return data;
  }

  @Get()
  async getBills(@Headers('restaurant_id') restaurant_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.getBills(restaurantId);
    return data;
  }

  @Get(':id/specificBill')
  async getSpecific(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.getSpecific(restaurantId, id);
    return data;
  }

  @Patch(':id')
  async update(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.update(restaurantId, id, updateBillDto);
    return data;
  }

  @Delete(':id')
  async delete(@Headers('restaurant_id') restaurant_id: string, @Param('id') id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.delete(restaurantId, id);
    return data;
  }

  @Get('activeBills')
  async getActiveBills(@Headers('restaurant_id') restaurant_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.getActiveBills(restaurantId);
    return data;
  }

  @Get('notActiveBills')
  async getNotActiveBills(@Headers('restaurant_id') restaurant_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.getNotActiveBills(restaurantId);
    return data;
  }

  @Get('specific-customer')
  async getBillsOfSpecificCustomer(@Headers('restaurant_id') restaurant_id: string, @Param('customer_id') customer_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.getBillsOfSpecificCustomer(restaurantId, customer_id);
    return data;
  }

  @Get('active-bill/specific-customer')
  async activeBillsOfSpecificCustomer(@Headers('restaurant_id') restaurant_id: string, @Param('customer_id') customer_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.getActiveBillsOfSpecificCustomer(restaurantId, customer_id);
    return data;
  }

  @Get('notActiveBill/specific-customer')
  async notActiveBillsOfSpecificCustomer(@Headers('restaurant_id') restaurant_id: string, @Param('customer_id') customer_id: string) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.getNotActiveBillsOfSpecificCustomer(restaurantId, customer_id);
    return data;
  }

  @UseGuards(ValidBillGuard)
  @Patch(':bill_id/specific-customer')
  async updateSpecificBillOfSpecificCustomer(
    @Headers('restaurant_id') restaurant_id: string,
    @Param('customer_id') customer_id: string,
    @Param('bill_id') bill_id: string,
    @Body() updateBill: UpdateBillDto,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.updateSpecificBillOfSpecificCustomer(restaurantId, customer_id, bill_id, updateBill);
    return data;
  }

  @UseGuards(ValidBillGuard)
  @Delete(':bill_id/specific-customer')
  async deleteSpecificBillOfSpecificCustomer(
    @Headers('restaurant_id') restaurant_id: string,
    @Param('customer_id') customer_id: string,
    @Param('bill_id') bill_id: string,
  ) {
    const restaurantId = new mongoose.Types.ObjectId(restaurant_id);
    const data = await this.billService.deleteSpecificBillOfSpecificCustomer(restaurantId, customer_id, bill_id);
    return data;
  }
}
