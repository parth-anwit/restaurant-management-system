import { Injectable } from '@nestjs/common';

import { Types } from 'mongoose';

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

  async find(restaurantId: Types.ObjectId, userId: string) {
    const data = await this.accessRepo.find(restaurantId, userId);

    return data;
  }

  async delete(id: string) {
    const data = await this.accessRepo.delete(id);
    return { message: 'access delete successfully', data };
  }
}
