import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers, UseGuards } from '@nestjs/common';

import { BillRepository } from './bill.repository';

import { JwtAuthGuard } from '../../auth/guards/jwt-user-auth.guard';
import { ValidRestaurantGuard } from '../../auth/guards/valid-restaurant.guard';

@Controller('bill')
@ApiTags('all bills')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard)
export class All_Bill_Controller {
  constructor(private billRepository: BillRepository) {}

  @Get('list')
  async getAllBill(@Headers('restaurant_id') restaurantId: string) {
    const data = this.billRepository.getBills(restaurantId);

    return data;
  }
}
