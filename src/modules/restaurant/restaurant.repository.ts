// import { AccessRepository } from 'src/access/access.repository';
// import { AccessRepository } from '../access/access.repository';
// import { BillService } from 'src/bill/bill.service';
// import { CustomerService } from 'src/customer/customer.service';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
// import { MealCategoryService } from 'src/mealCategory/mealCategory.service';
// import { MealService } from 'src/meal/meal.service';
import { Model } from 'mongoose';

import { AccessRepository } from '../access/access.repository';
// import { OrderService } from 'src/order/order.service';

import { Restaurant } from './restaurant.schema';

import { UpdateRestaurantDto } from './dtos/updateDto';

import { User } from '../user/user.schema';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name) private RestaurantModule: Model<Restaurant>,
    private accessRepo: AccessRepository,
    // private mealCategoryService: MealCategoryService,
    // private mealService: MealService,
    // private customerService: CustomerService,
    // private billService: BillService,
    // private orderService: OrderService,
  ) {}

  async create(name: string, location: string, user: User) {
    const newRestaurant = new this.RestaurantModule({ name, location });
    const data = newRestaurant.save();
    const accessData = await this.accessRepo.create({
      restaurantId: newRestaurant._id,
      userId: user._id,
      role: 'Owner',
    });
    return accessData;

    return data;
  }

  async get() {
    return this.RestaurantModule.find().exec();
  }

  async getSpecificRestaurant(id: string) {
    return this.RestaurantModule.findById(id);
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return this.RestaurantModule.findByIdAndUpdate(id, updateRestaurantDto, {
      new: true,
    });
  }

  async delete(id: string) {
    // this.accessRepo.deleteAccessByRestaurantId(id);
    // this.mealCategoryService.deleteMealCategoryByRestaurantId(id);
    // this.mealService.deleteMealByRestaurantId(id);
    // this.customerService.deleteCustomerByRestaurantId(id);
    // this.billService.deleteBillByRestaurantId(id);
    // this.orderService.deleteOrderByRestaurantId(id);
    return this.RestaurantModule.findByIdAndDelete(id);
  }
}
