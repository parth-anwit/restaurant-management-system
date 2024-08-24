import mongoose, { Types } from 'mongoose';

import { HttpException, Injectable } from '@nestjs/common';

import { MealCategoryRepository } from './meal-category.repository';

import { CreateMealCategoryDto } from './dtos/create.dto';
import { UpdateMealCategoryDto } from './dtos/update.dto';

@Injectable()
export class MealCategoryService {
  constructor(private mealCategoryRepository: MealCategoryRepository) {}

  async create(restaurantId: Types.ObjectId, createMealCategoryDto: CreateMealCategoryDto) {
    try {
      const findMealCategory = await this.mealCategoryRepository.findByMealCategoryName(createMealCategoryDto.name);

      if (findMealCategory) {
        throw new HttpException('mealCategory already present', 401);
      }

      const data = await this.mealCategoryRepository.create(restaurantId, createMealCategoryDto);
      if (!data) {
        throw new HttpException('something is wrong while meal category create', 401);
      }
      return {
        message: 'mealCategory created successfully',
        mealCategory: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async get(restaurantId: Types.ObjectId) {
    try {
      const data = await this.mealCategoryRepository.get(restaurantId);
      if (data.length === 0) {
        throw new HttpException('no meal category found', 404);
      }
      return {
        mealCategory: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('id is not valid', 404);
      }

      const findMealCategory = await this.mealCategoryRepository.getSpecific(restaurantId, id);

      if (!findMealCategory) {
        throw new HttpException('mealCategory not found', 404);
      }

      return {
        mealCategory: findMealCategory,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(restaurantId: Types.ObjectId, id: string, update: UpdateMealCategoryDto) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }
      const findMealCategory = await this.mealCategoryRepository.getSpecific(restaurantId, id);

      if (!findMealCategory) {
        throw new HttpException('mealCategory not found', 404);
      }

      const updateMealCategory = await this.mealCategoryRepository.update(restaurantId, update);

      if (!updateMealCategory) {
        throw new HttpException('something is wrong while update mealCategory', 404);
      }

      return {
        message: 'mealCategory updated successfully',
        updatedMealCategory: updateMealCategory,
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
      const findMealCategory = await this.mealCategoryRepository.getSpecific(restaurantId, id);

      if (!findMealCategory) {
        throw new HttpException('mealCategory not found', 404);
      }
      const deleteMealCategory = await this.mealCategoryRepository.delete(restaurantId, id);

      if (!deleteMealCategory) {
        throw new HttpException('something is wrong while delete mealCategory', 404);
      }

      return {
        message: 'Meal_Category delete successfully',
        deleteMealCategory,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
