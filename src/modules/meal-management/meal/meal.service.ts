import { HttpException, Injectable } from '@nestjs/common';

import mongoose, { Types } from 'mongoose';

import { CreateMealDto } from './dtos/create.dto';

import { UpdateMealDto } from './dtos/update.dto';

import { MealRepository } from './meal.repository';

@Injectable()
export class MealService {
  constructor(private mealRepository: MealRepository) {}

  async create(restaurantId: string, createMeal: CreateMealDto, mealCategoryId: string) {
    try {
      const findMeal = await this.mealRepository.findMealByName(createMeal.name);

      if (findMeal) {
        throw new HttpException('meal already present', 401);
      }

      const data = await this.mealRepository.create(restaurantId, createMeal, mealCategoryId);
      return {
        message: 'meal created successfully',
        meal: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async get(restaurantId: Types.ObjectId) {
    try {
      const data = await this.mealRepository.get(restaurantId);

      if (data.length === 0) {
        throw new HttpException('no meal  found', 404);
      }

      return {
        meal: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTotalMeals(id: Types.ObjectId) {
    try {
      const data = await this.mealRepository.getTotalMeals(id);

      if (data.length === 0) {
        throw new HttpException('no meal  found', 404);
      }

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMealsOnMealCategory(restaurantId: Types.ObjectId, mealCategoryId: string) {
    try {
      const data = await this.mealRepository.getMealsOnMealCategory(restaurantId, mealCategoryId);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const findMeal = await this.mealRepository.getSpecific(restaurantId, id);

      if (!findMeal) {
        throw new HttpException('meal not found', 404);
      }

      return {
        meal: findMeal,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, update: UpdateMealDto, restaurantId: Types.ObjectId, mealCategoryId: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const findMeal = await this.mealRepository.getSpecific(restaurantId, id);

      if (!findMeal) {
        throw new HttpException('meal not found', 404);
      }

      const updateMeal = await this.mealRepository.update(id, update, restaurantId, mealCategoryId);

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

  async delete(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const findMeal = await this.mealRepository.getSpecific(restaurantId, id);

      if (!findMeal) {
        throw new HttpException('meal not found', 404);
      }
      const deleteMealCategory = await this.mealRepository.delete(restaurantId, id);

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
