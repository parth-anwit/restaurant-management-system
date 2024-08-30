import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { AccessRepository } from '../access/access.repository';
import { Restaurant } from './restaurant.schema';

import { CreateRestaurantDto } from './dtos/createDto';
import { UpdateRestaurantDto } from './dtos/updateDto';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name) private RestaurantModule: Model<Restaurant>,
    private accessRepo: AccessRepository,
  ) {}

  async create(currentUser: UserDocument, createResDto: CreateRestaurantDto) {
    const newRestaurant = new this.RestaurantModule(createResDto);
    const data = newRestaurant.save();
    await this.accessRepo.create({
      restaurant: newRestaurant._id,
      user: currentUser.id,
      role: 'Owner',
    });
    return data;
  }

  async get(currentUser: UserDocument) {
    const getRestaurant = await this.accessRepo.findRestaurantOfCurrentUser(currentUser);

    // get the restaurant from accessData
    return getRestaurant.map((x) => x.restaurant);
  }

  async getSpecificRestaurant(id: string) {
    return this.RestaurantModule.findById(id);
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    return this.RestaurantModule.findByIdAndUpdate(id, updateRestaurantDto, {
      new: true,
    });
  }

  async delete(id: string) {
    return this.RestaurantModule.findByIdAndDelete(id);
  }
}
