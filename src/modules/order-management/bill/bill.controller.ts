import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { UserDocument } from '../../user/user.schema';

import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';

import { BillService } from './bill.service';

import { UpdateBillDto } from './dtos/update.dto';

import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ValidBillGuard } from '../../auth/guards/valid-bill.guard';
import { ValidCustomerGuard } from '../../auth/guards/valid-customer.guard';

@Controller('customer/:customerId/bill')
@ApiTags('Bill')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard, ValidCustomerGuard)
export class BillController {
  constructor(private billService: BillService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('session-start')
  async create(
    @Headers('restaurantId') restaurantId: string,
    @GetUser() currentUser: UserDocument,
    @Param('customerId') customerId: string,
  ) {
    const data = await this.billService.create(restaurantId, currentUser, customerId);
    return data;
  }

  @HttpCode(200)
  @UseGuards(ValidBillGuard)
  @Patch(':billId/session-end')
  @UsePipes(new ValidationPipe())
  async put(
    @Headers('restaurant_id') restaurantId: string,
    @GetUser() currentUser: UserDocument,
    @Param('customerId') customerId: string,
    @Param('billId') billId: string,
  ) {
    const data = await this.billService.endBillSession(restaurantId, currentUser, customerId, billId);
    return data;
  }

  @HttpCode(200)
  @UseGuards(ValidBillGuard)
  @Patch(':billId/generate-bill')
  @UsePipes(new ValidationPipe())
  async generateBill(
    @Headers('restaurant_id') restaurantId: string,
    @GetUser() currentUser: UserDocument,
    @Param('customerId') customerId: string,
    @Param('billId') billId: string,
  ) {
    const data = await this.billService.generateBill(restaurantId, currentUser, customerId, billId);
    return data;
  }

  @HttpCode(200)
  @Get()
  async getBills(@Headers('restaurant_id') restaurantId: string) {
    const data = await this.billService.getBills(restaurantId);
    return data;
  }

  @HttpCode(200)
  @Get(':billId/specific-bill')
  async getSpecific(@Headers('restaurant_id') restaurantId: string, @Param('billId') billId: string) {
    const data = await this.billService.getSpecific(restaurantId, billId);
    return data;
  }

  @HttpCode(200)
  @Patch(':billId')
  @UsePipes(new ValidationPipe())
  async update(@Headers('restaurant_id') restaurantId: string, @Param('billId') billId: string, @Body() updateBillDto: UpdateBillDto) {
    const data = await this.billService.update(restaurantId, billId, updateBillDto);
    return data;
  }

  @HttpCode(200)
  @Delete(':billId')
  async delete(@Headers('restaurant_id') restaurantId: string, @Param('billId') id: string) {
    const data = await this.billService.delete(restaurantId, id);
    return data;
  }

  @HttpCode(200)
  @Get('active-bill')
  async getActiveBills(@Headers('restaurant_id') restaurantId: string) {
    const data = await this.billService.getActiveBills(restaurantId);
    return data;
  }

  @HttpCode(200)
  @Get('not-active-bill')
  async getNotActiveBills(@Headers('restaurant_id') restaurantId: string) {
    const data = await this.billService.getNotActiveBills(restaurantId);
    return data;
  }

  @HttpCode(200)
  @Get('specific-customer')
  async getBillsOfSpecificCustomer(@Headers('restaurant_id') restaurantId: string, @Param('customerId') customerId: string) {
    const data = await this.billService.getBillsOfSpecificCustomer(restaurantId, customerId);
    return data;
  }

  @HttpCode(200)
  @Get('active-bill/specific-customer')
  async activeBillsOfSpecificCustomer(@Headers('restaurant_id') restaurantId: string, @Param('customerId') customerId: string) {
    const data = await this.billService.getActiveBillsOfSpecificCustomer(restaurantId, customerId);
    return data;
  }

  @HttpCode(200)
  @Get('not-active-bill/specific-customer')
  async notActiveBillsOfSpecificCustomer(@Headers('restaurant_id') restaurantId: string, @Param('customerId') customerId: string) {
    const data = await this.billService.getNotActiveBillsOfSpecificCustomer(restaurantId, customerId);
    return data;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(ValidBillGuard)
  @Patch(':billId/specific-customer')
  async updateSpecificBillOfSpecificCustomer(
    @Headers('restaurant_id') restaurantId: string,
    @Param('customerId') customerId: string,
    @Param('billId') billId: string,
    @Body() updateBill: UpdateBillDto,
  ) {
    const data = await this.billService.updateSpecificBillOfSpecificCustomer(restaurantId, customerId, billId, updateBill);
    return data;
  }

  @HttpCode(200)
  @UseGuards(ValidBillGuard)
  @Delete(':billId/specific-customer')
  async deleteSpecificBillOfSpecificCustomer(
    @Headers('restaurant_id') restaurantId: string,
    @Param('customerId') customerId: string,
    @Param('billId') billId: string,
  ) {
    const data = await this.billService.deleteSpecificBillOfSpecificCustomer(restaurantId, customerId, billId);
    return data;
  }
}
