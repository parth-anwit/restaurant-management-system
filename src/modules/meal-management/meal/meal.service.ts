import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { idChecker } from '../../invalidIDChecker';

import { CreateMealDto } from './dtos/create.dto';

import { UpdateMealDto } from './dtos/update.dto';

import { MealRepository } from './meal.repository';

@Injectable()
export class MealService {
  constructor(private mealRepository: MealRepository) {}

  async create(restaurantId: string, mealCategoryId: string, createMeal: CreateMealDto) {
    const findMeal = await this.mealRepository.findMealByName(createMeal.name);

    if (findMeal) {
      throw new BadRequestException('meal already present');
    }

    const data = await this.mealRepository.create(restaurantId, mealCategoryId, createMeal);
    return {
      message: 'meal created successfully',
      meal: data,
    };
  }

  async get(restaurantId: string) {
    const data = await this.mealRepository.get(restaurantId);

    if (data.length === 0) {
      throw new NotFoundException('no meal  found');
    }

    return {
      meal: data,
    };
  }

  async getTotalMeals(mealId: string) {
    try {
      const data = await this.mealRepository.getTotalMeals(mealId);

      if (data.length === 0) {
        throw new NotFoundException('no meal  found');
      }

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMealsOnMealCategory(restaurantId: string, mealCategoryId: string) {
    try {
      const data = await this.mealRepository.getMealsOnMealCategory(restaurantId, mealCategoryId);
      if (data.length === 0) {
        throw new HttpException('no meal found on this category', 404);
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSpecific(restaurantId: string, mealId: string) {
    idChecker(mealId);

    const findMeal = await this.mealRepository.getSpecific(restaurantId, mealId);

    if (!findMeal) {
      throw new HttpException('meal not found', 404);
    }

    return {
      meal: findMeal,
    };
  }

  async update(restaurantId: string, mealCategoryId: string, mealId: string, update: UpdateMealDto) {
    idChecker(mealId);

    const updateMeal = await this.mealRepository.update(restaurantId, mealCategoryId, mealId, update);

    if (!updateMeal) {
      throw new NotFoundException('meal category not found');
    }

    return {
      message: 'meal update successfully',
      updateMeal,
    };
  }

  async delete(restaurantId: string, mealId: string) {
    idChecker(mealId);

    const deleteMealCategory = await this.mealRepository.delete(restaurantId, mealId);

    if (!deleteMealCategory) {
      throw new NotFoundException('mealCategory not found');
    }
    return {
      message: 'meal delete successfully',
      deleteMeal: deleteMealCategory,
    };
  }
}
