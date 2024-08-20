import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import mongoose from 'mongoose';

import { User } from '../user/user.schema';

import { CreateRestaurantDto } from './dtos/createDto';
import { UpdateRestaurantDto } from './dtos/updateDto';

import { RestaurantRepository } from './restaurant.repository';

@Injectable()
export class RestaurantService {
  constructor(private restaurantRepo: RestaurantRepository) {}

  async create(createRestaurant: CreateRestaurantDto, user: User) {
    try {
      const { name, location } = createRestaurant;

      const data = await this.restaurantRepo.create(name, location, user);

      return { message: 'restaurant created successfully', data };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus,
          error: `something is wrong at restaurant creation`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async get() {
    try {
      const data = await this.restaurantRepo.get();

      return { data };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus,
          error: `no restaurant found`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getSpecificRestaurant(id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('id is not correct', 404);
      }
      const findRestaurant = await this.restaurantRepo.getSpecificRestaurant(id);
      if (!findRestaurant) {
        throw new HttpException('restaurant not found', 404);
      }
      return {
        restaurant: findRestaurant,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    try {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new HttpException('Invalid ID', 400);
      }

      const findRestaurant = await this.restaurantRepo.getSpecificRestaurant(id);
      if (!findRestaurant) {
        throw new HttpException('restaurant not found', 404);
      }

      const updateRestaurant = await this.restaurantRepo.update(id, updateRestaurantDto);
      if (!updateRestaurant) {
        throw new HttpException('something is wrong while update the restaurant', 404);
      }

      return {
        message: 'restaurant updated successfully',
        updateRestaurant,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('user not found', 404);
      }
      const findRestaurant = await this.restaurantRepo.getSpecificRestaurant(id);
      if (!findRestaurant) {
        throw new HttpException('restaurant not found', 404);
      }

      const deleteRestaurant = await this.restaurantRepo.delete(id);

      if (!deleteRestaurant) {
        throw new HttpException('something is wrong while delete restaurant', 404);
      }

      return {
        message: 'restaurant delete successfully',
        deletedRestaurant: deleteRestaurant,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
