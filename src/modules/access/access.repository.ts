import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Model, Types } from 'mongoose';

import { Access } from './access.schema';

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
    return data;
  }

  async delete(id: string) {
    const data = await this.AccessModule.findByIdAndDelete(id);
    return data;
  }
}
