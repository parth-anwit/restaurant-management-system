import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateMealDto } from './dtos/create.dto';

import { Meal } from './meal.schema';

import { UpdateMealDto } from './dtos/update.dto';

@Injectable()
export class MealRepository {
  constructor(@InjectModel(Meal.name) private MealModule: Model<Meal>) {}

  async create(restaurantId: string, createMeal: CreateMealDto, mealCategoryId: string) {
    const { name, money } = createMeal;
    const data = new this.MealModule({
      restaurant: restaurantId,
      mealCategory: mealCategoryId,
      name,
      money,
    });

    return data.save();
  }

  async get(restaurantId: Types.ObjectId) {
    const data = await this.MealModule.find({ restaurant: restaurantId }).exec();
    return data;
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    const data = await this.MealModule.findOne({ restaurant: restaurantId, _id: id });
    return data;
  }

  async getTotalMeals(id: Types.ObjectId) {
    const data = await this.MealModule.find({ _id: id });
    return data;
  }

  async getMealsOnMealCategory(restaurantId: Types.ObjectId, mealCategoryId: string) {
    const data = await this.MealModule.find({ restaurant: restaurantId, mealCategory: mealCategoryId });
    console.log('data', data);
    return data;
  }

  async findMealByName(name: string) {
    const data = await this.MealModule.findOne({ name });
    if (data) {
      return true;
    }
    return false;
  }

  async update(id: string, update: UpdateMealDto, restaurantId: Types.ObjectId, mealCategoryId: string) {
    const { name, money } = update;
    const data = await this.MealModule.findOneAndUpdate(
      { _id: id, restaurant: restaurantId },
      {
        $set: {
          name,
          mealCategory: mealCategoryId,
          money,
          restaurant: restaurantId,
        },
      },
    );
    return data;
  }

  async deleteMealByMealCategoryId(mealCategoryId: string) {
    const data = await this.MealModule.deleteMany({ mealCategory: mealCategoryId });
    return data;
  }

  async deleteMealByRestaurantId(resId: string) {
    const data = await this.MealModule.deleteMany({ restaurant: resId });
    if (data.deletedCount === 0) {
      throw new HttpException('no access found with this restaurantId', 404);
    }
    return data;
  }

  async delete(restaurantId: Types.ObjectId, id: string) {
    const data = await this.MealModule.findOneAndDelete({ restaurant: restaurantId, _id: id });
    return data;
  }
}
