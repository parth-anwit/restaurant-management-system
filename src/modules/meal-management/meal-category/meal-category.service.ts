import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { idChecker } from '../../invalidIDChecker';

import { MealCategoryRepository } from './meal-category.repository';

import { CreateMealCategoryDto } from './dtos/create.dto';
import { UpdateMealCategoryDto } from './dtos/update.dto';

@Injectable()
export class MealCategoryService {
  constructor(private mealCategoryRepository: MealCategoryRepository) {}

  async create(restaurantId: string, createMealCategoryDto: CreateMealCategoryDto) {
    const findMealCategory = await this.mealCategoryRepository.findByMealCategoryName(createMealCategoryDto.name);

    if (findMealCategory) {
      throw new BadRequestException('mealCategory already present');
    }

    const data = await this.mealCategoryRepository.create(restaurantId, createMealCategoryDto);
    if (!data) {
      throw new NotFoundException('something is wrong while meal category create');
    }
    return {
      message: 'mealCategory created successfully',
      mealCategory: data,
    };
  }

  async getList(restaurantId: string, pageNum: number, pageSizeNum: number) {
    const mealCategory = await this.mealCategoryRepository.getList(restaurantId, pageNum, pageSizeNum);

    return {
      success: true,
      mealCategory: {
        metaData: {
          totalCount: mealCategory.totalCount,
          page: pageNum,
          pageSize: pageSizeNum,
        },
        data: mealCategory.mealCategoryListData,
      },
    };
  }

  async get(restaurantId: string) {
    const data = await this.mealCategoryRepository.get(restaurantId);
    if (data.length === 0) {
      throw new NotFoundException('no meal category found');
    }
    return {
      mealCategory: data,
    };
  }

  async getSpecific(restaurantId: string, mealCategoryId: string) {
    idChecker(mealCategoryId);
    const findMealCategory = await this.mealCategoryRepository.getSpecific(restaurantId, mealCategoryId);

    if (!findMealCategory) {
      throw new NotFoundException('mealCategory not found');
    }

    return {
      mealCategory: findMealCategory,
    };
  }

  async update(restaurantId: string, mealCategoryId: string, update: UpdateMealCategoryDto) {
    try {
      idChecker(mealCategoryId);

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

  async delete(restaurantId: string, mealCategoryId: string) {
    try {
      idChecker(mealCategoryId);

      const deleteMealCategory = await this.mealCategoryRepository.delete(restaurantId, mealCategoryId);

      if (!deleteMealCategory) {
        throw new NotFoundException('something is wrong while delete mealCategory');
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
