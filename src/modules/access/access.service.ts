import { Injectable } from '@nestjs/common';

import { AccessRepository } from './access.repository';

import { Access } from './access.schema';

@Injectable()
export class AccessService {
  constructor(private accessRepo: AccessRepository) {}

  async create(access: Access) {
    const newAccess = await this.accessRepo.create(access);
    return {
      message: 'new access create successfully',
      access: newAccess,
    };
  }

  async find(restaurantId: string, userId: string) {
    const data = await this.accessRepo.find(restaurantId, userId);

    return { data };
  }

  //   async deleteAccessByUserId(userId: string | Types.ObjectId) {
  //     const data = await this.accessRepo.deleteAccessByUserId(userId);

  //     return { message: 'access delete successfully by userId', data: data };
  //   }

  //   async deleteAccessByRestaurantId(restaurantId: string) {
  //     const data = await this.accessRepo.deleteAccessByRestaurantId(restaurantId);

  //     return {
  //       message: 'access delete successfully by restaurantId',
  //       data: data,
  //     };
  // }

  async delete(id: string) {
    const data = await this.accessRepo.delete(id);
    return { message: 'access delete successfully', data };
    return data;
  }
}
