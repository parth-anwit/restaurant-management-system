import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model, Types } from 'mongoose';

import { Access } from './access.schema';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AccessRepository {
  constructor(@InjectModel(Access.name) private AccessModule: Model<Access>) {}

  async create(access: Access) {
    const newAccess = new this.AccessModule(access);
    newAccess.save();
  }

  async find(restaurantId: Types.ObjectId, userId: string) {
    const data = await this.AccessModule.findOne({ restaurant: restaurantId, user: userId });

    return data;
  }

  async getRestaurant(currentUser: UserDocument) {
    const restaurant = await this.AccessModule.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(currentUser.id) } },
      { $lookup: { from: 'restaurants', localField: 'restaurant', foreignField: '_id', as: 'restaurant_info' } },
      { $unwind: { path: '$restaurant_info' } },
      { $replaceRoot: { newRoot: '$restaurant_info' } },
      { $project: { _id: 0, user: 0, restaurant: 0, role: 0, __v: 0 } },
    ]);
    return restaurant;
  }

  async findRestaurantOfCurrentUser(currentUser: UserDocument, page: number, pageSize: number) {
    const restaurant = await this.AccessModule.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(currentUser.id),
        },
      },

      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant_info',
        },
      },
      {
        $unwind: {
          path: '$restaurant_info',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: { newRoot: '$restaurant_info' },
      },

      {
        $project: {
          _id: 0,
          user: 0,
          restaurant: 0,
          role: 0,
          __v: 0,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    return {
      totalCount: restaurant[0]?.metadata[0]?.totalCount || 0,
      data: restaurant[0]?.data || [],
    };
  }

  async getUserAccess(userId: string) {
    const data = await this.AccessModule.find({ userId });
    return data;
  }

  async deleteAccessByUserId(user_id: string) {
    const data = await this.AccessModule.deleteMany({ user: user_id });
    return data;
  }

  async deleteAccessByRestaurantId(restaurantId: string) {
    const data = await this.AccessModule.deleteMany({ restaurant: restaurantId });
    if (data.deletedCount === 0) {
      throw new HttpException('no access found with this restaurantId', 404);
    }
    return data;
  }

  async delete(id: string) {
    const data = await this.AccessModule.findByIdAndDelete(id);
    return data;
  }
}
