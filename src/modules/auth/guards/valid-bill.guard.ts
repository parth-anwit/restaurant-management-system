import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';

import { BillRepository } from '../../order-management/bill/bill.repository';

@Injectable()
export class ValidBillGuard implements CanActivate {
  constructor(private billRepository: BillRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const restaurantId = request.headers.restaurant_id;
    if (!restaurantId) {
      throw new UnauthorizedException();
    }
    const billId = request.params.bill_id;
    if (!billId) {
      throw new HttpException('bill-id not found', 404);
    }
    const data = await this.billRepository.getSpecific(restaurantId, billId);

    if (!data) {
      throw new HttpException('please provide valid bill', 404);
    }
    return true;
  }
}
