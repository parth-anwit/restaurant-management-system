// External dependencies
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, Logger, Param, Patch, UseGuards } from '@nestjs/common';

// Internal dependencies
import { Types } from 'mongoose';

import { GetProfileResDto } from './dtos';

import { UserDocument } from './user.schema';

// Other modules dependencies
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQueryService } from './user.query.service';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserQueryService) {}

  private readonly logger = new Logger(UserController.name);

  @HttpCode(200)
  @ApiOkResponse({
    type: GetProfileResDto,
  })
  @Get('me')
  async getFullAccess(@GetUser() user: UserDocument): Promise<GetProfileResDto> {
    this.logger.debug(`User ${user.email} requested their profile`);
    return {
      message: 'Profile retrieved successfully',
      user,
    };
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(id, updateUserDto);

    return { message: 'User update successfully', user: data };
  }

  @Delete('/:id')
  async deleteUser(@GetUser() user: UserDocument) {
    const userId = user._id;

    const data = await this.userService.delete(userId);

    return {
      message: 'User delete successfully',
      deletedUser: data,
    };
  }
}
