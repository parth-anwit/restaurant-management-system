import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { CreateMealCategoryDto } from './dtos/create.dto';
import { MealCategory } from './meal-category.schema';

import { MealRepository } from '../meal/meal.repository';
import { UpdateMealCategoryDto } from './dtos/update.dto';

@Injectable()
export class MealCategoryRepository {
  constructor(
    @InjectModel(MealCategory.name)
    private MealCategoryModule: Model<MealCategory>,
    private mealRepository: MealRepository,
  ) {}

  async create(restaurantId: Types.ObjectId, createMealCategoryDto: CreateMealCategoryDto) {
    const { name } = createMealCategoryDto;
    const data = new this.MealCategoryModule({
      restaurant: restaurantId,
      name,
    });
    return data.save();
  }

  async get(restaurantId: Types.ObjectId) {
    const data = await this.MealCategoryModule.find({ restaurant: restaurantId }).exec();
    return data;
  }

  async findByMealCategoryName(name: string) {
    const data = await this.MealCategoryModule.findOne({ name });
    if (data) {
      return true;
    }
    return false;
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    const data = await this.MealCategoryModule.findOne({ restaurant: restaurantId, _id: id });
    return data;
  }

  async update(restaurantId: Types.ObjectId, update: UpdateMealCategoryDto) {
    const data = await this.MealCategoryModule.findOneAndUpdate({ restaurant: restaurantId }, update, { new: true });

    return data;
  }

  async deleteMealCategoryByRestaurantId(restaurantId: string) {
    const data = await this.MealCategoryModule.deleteMany({
      restaurant: restaurantId,
    });
    if (data.deletedCount === 0) {
      throw new HttpException('no access found with this restaurantId', 404);
    }
    return data;
  }

  async delete(restaurantId: Types.ObjectId, id: string) {
    this.mealRepository.deleteMealByMealCategoryId(id);
    const data = await this.MealCategoryModule.findOneAndDelete({ restaurant: restaurantId, _id: id });
    return data;
  }
}
