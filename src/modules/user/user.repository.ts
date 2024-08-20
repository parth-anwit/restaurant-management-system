// Purpose: User repository for user module.
// External dependencies
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

// Internal dependencies
import { User, UserDocument } from './user.schema';

// Shared dependencies
import { DatabaseCollectionNames } from '../../shared/enums/db.enum';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(DatabaseCollectionNames.USER) private userModel: Model<UserDocument>) {}

  async find(filter: FilterQuery<UserDocument>): Promise<User[]> {
    return this.userModel.find(filter).lean();
  }

  async findById(id: string | Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).lean();
  }

  async findOne(filter: FilterQuery<UserDocument>): Promise<User | null> {
    return this.userModel.findOne(filter).lean();
  }

  async create(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  async findOneAndUpdate(
    filter: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
    options: QueryOptions<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(filter, update, options);
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    update: UpdateQuery<UserDocument>,
    options: QueryOptions<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, update, options);
  }

  async deleteUser(id: Types.ObjectId) {
    return this.userModel.deleteOne(id);
  }

  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateUserDto,
        },
      },
      { new: true },
    );
    return user;
  }
}
