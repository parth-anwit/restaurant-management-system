import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AccessService } from '../../access/access.service';

@Injectable()
export class ValidRestaurantGuard implements CanActivate {
  constructor(private accessService: AccessService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const restaurantId = request.headers.restaurant_id;
    if (!restaurantId) {
      throw new UnauthorizedException();
    }

    const userId = request.user;

    const data = await this.accessService.find(restaurantId, userId);
    if (!data) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
