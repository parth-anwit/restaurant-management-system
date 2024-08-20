import { HttpException, Injectable } from '@nestjs/common';

import mongoose, { Types } from 'mongoose';

import { CreateMealDto } from './dtos/create.dto';

import { UpdateMealDto } from './dtos/update.dto';

import { MealRepository } from './meal.repository';

@Injectable()
export class MealService {
  constructor(
    private mealRepository: MealRepository,
    // private orderService: OrderService,
  ) {}

  async create(restaurantId: string, createMeal: CreateMealDto) {
    try {
      const findMeal = await this.mealRepository.findMealByName(createMeal.name);

      if (findMeal) {
        throw new HttpException('meal already present', 401);
      }

      const data = await this.mealRepository.create(restaurantId, createMeal);
      return {
        message: 'meal created successfully',
        meal: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async get() {
    try {
      const data = await this.mealRepository.get();

      if (data.length === 0) {
        throw new HttpException('no meal found', 404);
      }

      return {
        meal: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSpecific(id: Types.ObjectId) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const findMeal = await this.mealRepository.getSpecific(id);

      if (!findMeal) {
        throw new HttpException('restaurant not found', 404);
      }

      return {
        meal: findMeal,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: Types.ObjectId, update: UpdateMealDto, restaurant_id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const findMeal = await this.mealRepository.getSpecific(id);

      if (!findMeal) {
        throw new HttpException('meal not found', 404);
      }

      const updateMeal = await this.mealRepository.update(id, update, restaurant_id);

      if (!updateMeal) {
        throw new HttpException('meal category not found', 404);
      }

      return {
        message: 'meal update successfully',
        updateMeal,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  //   async deleteMealByMealCategoryId(mealCategoryId: string) {
  //     const data = await this.mealRepository.deleteMealByMealCategoryId(mealCategoryId);

  //     return {
  //       message: 'delete meal by mealcategoryid',
  //       data: data,
  //     };
  //   }

  //   async deleteMealByRestaurantId(resId: string) {
  //     const data = await this.mealRepository.deleteMealByRestaurantId(resId);

  //     return {
  //       message: 'delete meal by restaurantId',
  //       data: data,
  //     };
  //   }

  async delete(id: Types.ObjectId) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const findMeal = await this.mealRepository.getSpecific(id);

      if (!findMeal) {
        throw new HttpException('meal not found', 404);
      }
      const deleteMealCategory = await this.mealRepository.delete(id);

      if (!deleteMealCategory) {
        throw new HttpException('mealCategory not found', 404);
      }
      return {
        message: 'meal delete successfully',
        deleteMeal: deleteMealCategory,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
