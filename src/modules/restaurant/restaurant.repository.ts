import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';

import { AccessRepository } from '../access/access.repository';
import { Restaurant } from './restaurant.schema';

import { CreateRestaurantDto } from './dtos/createDto';
import { UpdateRestaurantDto } from './dtos/updateDto';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name) private RestaurantModule: Model<Restaurant>,
    private accessRepo: AccessRepository,
  ) {}

  async create(createResDto: CreateRestaurantDto, userId: string) {
    const newRestaurant = new this.RestaurantModule(createResDto);
    const data = newRestaurant.save();
    await this.accessRepo.create({
      restaurant: newRestaurant._id,
      user: new mongoose.Types.ObjectId(userId),
      role: 'Owner',
    });
    return data;
  }

  async get() {
    return this.RestaurantModule.find().exec();
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
