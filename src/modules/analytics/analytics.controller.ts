import { Controller, Get, Headers, HttpCode, Query } from '@nestjs/common';

import { BillService } from '../order-management/bill/bill.service';
import { OrderService } from '../order-management/order/order.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private billService: BillService,
    private orderService: OrderService,
  ) {}

  // @HttpCode(200)
  // @Get('/popular-meal-mealCategory/bill')
  // async findPopularMealFromBill(@Query('month') month: string) {
  //   const monthNum = parseInt(month, 10) || 1;
  //   const bill = await this.billService.findPopularMeal(monthNum);
  //   return bill;
  // }

  @HttpCode(200)
  @Get('/popular-meal-mealCategory/order')
  async findPopularMeal(@Query('month') month: string, @Query('timezone') timezone: string) {
    const monthNum = parseInt(month, 10) || 1;

    const bill = await this.orderService.findPopular_Meal_MealCategory(monthNum, timezone);
    return bill;
  }

  @HttpCode(200)
  @Get('avg-spend-customer')
  async avgSpendCustomerOnBill(@Headers('restaurant_id') restaurantId: string) {
    const customer = await this.billService.avgSpendCustomerOnBill(restaurantId);
    return customer;
  }

  @HttpCode(200)
  @Get('customer-spend-more-time')
  async customerSpendMoreTime(@Headers('restaurant_id') restaurantId: string) {
    const customer = await this.billService.customerSpendMoreTime(restaurantId);
    return customer;
  }
}
