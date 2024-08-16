import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';

import { Access } from './access.schema';

@Injectable()
export class AccessRepository {
  constructor(@InjectModel(Access.name) private AccessModule: Model<Access>) {}

  async create(access: Access) {
    const newAccess = new this.AccessModule(access);
    newAccess.save();
  }

  async find(restaurantId: string, userId: string) {
    const query = {
      restaurantId,
      userId,
    };

    const data = await this.AccessModule.findOne(query);

    return data;
  }

  //   async deleteAccessByUserId(userId: string | Types.ObjectId) {
  //     return await this.accessModule.deleteMany({ userId: userId });
  //   }

  //   async deleteAccessByRestaurantId(restaurantId: string) {
  //     return await this.accessModule.deleteMany({ restaurantId: restaurantId });
  //   }

  async delete(id: string) {
    const data = await this.AccessModule.findByIdAndDelete(id);
    return data;
  }
}
