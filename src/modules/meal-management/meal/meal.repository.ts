import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { CreateMealDto } from './dtos/create.dto';

import { Meal } from './meal.schema';

import { UpdateMealDto } from './dtos/update.dto';

@Injectable()
export class MealRepository {
  constructor(@InjectModel(Meal.name) private MealModule: Model<Meal>) {}

  async create(restaurantId: string, mealCategoryId: string, createMeal: CreateMealDto) {
    const { name, money } = createMeal;
    const data = new this.MealModule({
      restaurant: new mongoose.Types.ObjectId(restaurantId),
      mealCategory: new mongoose.Types.ObjectId(mealCategoryId),
      name,
      money,
    });

    return data.save();
  }

  async get(restaurantId: string) {
    const data = await this.MealModule.find({ restaurant: restaurantId }).exec();
    return data;
  }

  async getSpecific(restaurantId: string, mealId: string) {
    const data = await this.MealModule.findOne({ restaurant: restaurantId, _id: mealId });
    return data;
  }

  async getTotalMeals(mealId: string) {
    const data = await this.MealModule.find({ _id: mealId });
    return data;
  }

  async getMealsOnMealCategory(restaurantId: string, mealCategoryId: string) {
    const data = await this.MealModule.find({ restaurant: restaurantId, mealCategory: mealCategoryId });
    return data;
  }

  async findMealByName(name: string) {
    const data = await this.MealModule.findOne({ name });
    if (data) {
      return true;
    }
    return false;
  }

  async update(restaurantId: string, mealCategoryId: string, mealId: string, update: UpdateMealDto) {
    const { name, money } = update;
    const data = await this.MealModule.findOneAndUpdate(
      { _id: mealId, restaurant: restaurantId },
      {
        $set: {
          name,
          mealCategory: new mongoose.Types.ObjectId(mealCategoryId),
          money,
          restaurant: new mongoose.Types.ObjectId(restaurantId),
        },
      },
      { new: true },
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

  async delete(restaurantId: string, mealId: string) {
    const data = await this.MealModule.findOneAndDelete({ restaurant: restaurantId, _id: mealId });
    return data;
  }
}
