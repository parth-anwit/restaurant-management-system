import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerRepository } from '../../customer-management/customer/customer.repository';

@Injectable()
export class ValidCustomerGuard implements CanActivate {
  constructor(private customerRepository: CustomerRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const customerID = request.params.customerId;
    const restaurantId = request.headers.restaurant_id;
    if (!restaurantId) {
      throw new UnauthorizedException();
    }
    if (!customerID) {
      throw new HttpException('customer not found', 404);
    }

    const data = await this.customerRepository.getSpecific(restaurantId, customerID);

    if (!data) {
      throw new HttpException('please provide valid customer', 404);
    }
    return true;
  }
}
