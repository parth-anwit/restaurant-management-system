// Objective: Implement the user query service to handle the user queries
// External dependencies
import { Injectable, NotFoundException } from '@nestjs/common';

// Internal dependencies
import { User, UserDocument } from './user.schema';
import { UserRepository } from './user.repository';

// Other modules dependencies

// Shared dependencies
import { Identifier } from '../../shared/types/schema.type';
import { InternalServerErrorException } from '../../exceptions/internal-server-error.exception';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserQueryService {
  constructor(private readonly userRepository: UserRepository) {}

  // findByEmail is a method that finds a user by their email address
  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ email });
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  // findById is a method that finds a user by their unique identifier
  async findById(id: Identifier): Promise<User> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  // create is a method that creates a new user
  async create(user: User): Promise<UserDocument> {
    try {
      return await this.userRepository.create(user);
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const updateUserData = await this.userRepository.update(userId, updateUserDto);
    return updateUserData;
  }

  async delete(currentUser: UserDocument) {
    const deleteUser = await this.userRepository.deleteUser(currentUser);

    if (!deleteUser) {
      throw new NotFoundException('user not found');
    }

    return deleteUser;
  }
}
