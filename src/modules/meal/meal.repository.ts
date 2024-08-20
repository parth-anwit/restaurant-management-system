import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { CreateMealDto } from './dtos/create.dto';

import { Meal } from './meal.schema';

import { UpdateMealDto } from './dtos/update.dto';
// import { OrderService } from 'src/order/order.service';
@Injectable()
export class MealRepository {
  constructor(
    @InjectModel(Meal.name) private MealModule: Model<Meal>,
    // private orderService: OrderService,
  ) {}

  async create(restaurantId: string, createMeal: CreateMealDto) {
    const { name, mealCategory_id, money } = createMeal;
    const data = new this.MealModule({
      restaurant: restaurantId,
      mealCategory: mealCategory_id,
      name,
      money,
    });

    return data.save();
  }

  async get() {
    const data = await this.MealModule.find().exec();
    return data;
  }

  async getSpecific(id: Types.ObjectId) {
    const data = await this.MealModule.findById(id);
    return data;
  }

  async getAllMeal(id: Types.ObjectId) {
    const data = await this.MealModule.find({ mealCategory: id });
    return data;
  }

  async findMealByName(name: string) {
    const data = await this.MealModule.findOne({ name });
    if (data) {
      return true;
    }
    return false;
  }

  async update(id: Types.ObjectId, update: UpdateMealDto, restaurant_id: string) {
    const { name, money } = update;
    const data = await this.MealModule.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          mealCategory: update.mealCategory_id,
          money,
          restaurant: restaurant_id,
        },
      },
    );
    return data;
  }

  //   async deleteMealByMealCategoryId(mealCategoryId: string) {
  //     return await this.mealModule.deleteMany({ mealCategory: mealCategoryId });
  //   }

  //   async deleteMealByRestaurantId(resId: string) {
  //     return await this.mealModule.deleteMany({ restaurant: resId });
  //   }

  async delete(id: Types.ObjectId) {
    // this.orderService.deleteOrderByMealId(id);

    const data = await this.MealModule.findByIdAndDelete(id);
    return data;
  }
}
