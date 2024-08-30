import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateRestaurantDto } from './dtos/createDto';
import { UpdateRestaurantDto } from './dtos/updateDto';

import { RestaurantRepository } from './restaurant.repository';
import { UserDocument } from '../user/user.schema';

import { idChecker } from '../invalidIDChecker';

@Injectable()
export class RestaurantService {
  constructor(private restaurantRepo: RestaurantRepository) {}

  async create(currentUser: UserDocument, createRestaurant: CreateRestaurantDto) {
    const data = await this.restaurantRepo.create(currentUser, createRestaurant);

    if (!data) {
      throw new ConflictException('something is wrong while create restaurant');
    }

    return { message: 'restaurant created successfully', data };
  }

  async get(currentUser: UserDocument) {
    const data = await this.restaurantRepo.get(currentUser);
    if (data.length === 0) {
      throw new NotFoundException('restaurant not found');
    }

    return data;
  }

  async getSpecificRestaurant(id: string) {
    idChecker(id);

    const findRestaurant = await this.restaurantRepo.getSpecificRestaurant(id);

    if (!findRestaurant) {
      throw new NotFoundException('restaurant not found');
    }
    return {
      restaurant: findRestaurant,
    };
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    idChecker(id);
    const updateRestaurant = await this.restaurantRepo.update(id, updateRestaurantDto);
    if (!updateRestaurant) {
      throw new BadRequestException('Something is wrong while update the restaurant');
    }

    return {
      message: 'restaurant updated successfully',
      updateRestaurant,
    };
  }

  async delete(id: string) {
    idChecker(id);

    const deleteRestaurant = await this.restaurantRepo.delete(id);

    if (!deleteRestaurant) {
      throw new NotFoundException('something is wrong while delete restaurant');
    }

    return {
      message: 'restaurant delete successfully',
      deletedRestaurant: deleteRestaurant,
    };
  }
}
