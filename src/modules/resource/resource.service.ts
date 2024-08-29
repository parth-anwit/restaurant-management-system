import { Injectable } from '@nestjs/common';

import { AccessRepository } from '../access/access.repository';
import { BillRepository } from '../order-management/bill/bill.repository';
import { CustomerRepository } from '../customer-management/customer/customer.repository';
import { MealCategoryRepository } from '../meal-management/meal-category/meal-category.repository';
import { MealRepository } from '../meal-management/meal/meal.repository';
import { OrderRepository } from '../order-management/order/order.repository';
import { RestaurantRepository } from '../restaurant/restaurant.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class ResourceService {
  constructor(
    private customerRepository: CustomerRepository,
    private orderRepository: OrderRepository,
    private billRepository: BillRepository,
    private restaurantRepository: RestaurantRepository,
    private accessRepository: AccessRepository,
    private mealRepository: MealRepository,
    private mealCategoryRepository: MealCategoryRepository,
    private userRepository: UserRepository,
  ) {}

  async deleteRestaurantSubPart(restaurantId: string) {
    await this.accessRepository.deleteAccessByRestaurantId(restaurantId);
    await this.orderRepository.deleteOrderByRestaurantId(restaurantId);
    await this.billRepository.deleteBillByRestaurantId(restaurantId);
    await this.restaurantRepository.delete(restaurantId);
    await this.customerRepository.deleteCustomerByRestaurantId(restaurantId);
    await this.mealCategoryRepository.deleteMealCategoryByRestaurantId(restaurantId);
    await this.mealRepository.deleteMealByRestaurantId(restaurantId);

    return {
      message: 'Delete Customer,Order,Bill,Restaurant,Access,Meal,MealCategory successfully',
    };
  }

  async deleteUserSubPart(userId: string) {
    // user delete -> delete all restaurant that user have

    const user = await this.accessRepository.getUserAccess(userId);

    user.forEach((item) => {
      this.deleteRestaurantSubPart(item.restaurant.toString());
    });

    await this.userRepository.deleteUserByResource(userId);

    return {
      message: 'Delete Customer , Order , Bill , Restaurant , Access , Meal , MealCategory , User successfully',
    };
  }
}
