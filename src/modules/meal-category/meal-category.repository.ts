import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';

import { CreateMealCategoryDto } from './dtos/create.dto';
import { MealCategory } from './meal-category.schema';

// import { OrderService } from '../order/order.service';

import { UpdateMealCategoryDto } from './dtos/update.dto';

@Injectable()
export class MealCategoryRepository {
  constructor(
    @InjectModel(MealCategory.name)
    private MealCategoryModule: Model<MealCategory>,
    // private mealService: MealService,
    // private orderService: OrderService,
  ) {}

  async create(restaurantId: string, createMealCategoryDto: CreateMealCategoryDto) {
    const { name } = createMealCategoryDto;
    const data = await new this.MealCategoryModule({
      restaurant: restaurantId,
      name,
    });
    return data.save();
  }

  async get() {
    const data = await this.MealCategoryModule.find().exec();
    return data;
  }

  async findByMealCategoryName(name: string) {
    const data = await this.MealCategoryModule.findOne({ name });
    if (data) {
      return true;
    }
    return false;
  }

  async getSpecific(id: string) {
    const data = await this.MealCategoryModule.findById(id);
    return data;
  }

  async update(id: string, update: UpdateMealCategoryDto) {
    const data = await this.MealCategoryModule.findByIdAndUpdate(id, update, {
      new: true,
    });
    return data;
  }

  // async deleteMealCategoryByRestaurantId(restaurantId: string) {
  //   const data = await this.MealCategoryModule.deleteMany({
  //     restaurant: restaurantId,
  //   });
  //   return data;
  // }

  async delete(id: string) {
    // this.orderService.deleteOrderByMealCategoryId(id);
    // this.mealService.deleteMealByMealCategoryId(id);
    const data = await this.MealCategoryModule.findByIdAndDelete(id);
    return data;
  }
}
