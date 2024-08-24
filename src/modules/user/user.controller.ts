// External dependencies
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpCode, Logger, Param, Patch, UseGuards } from '@nestjs/common';

// Internal dependencies

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
  async updateUser(@Param('id') id: string, updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(id, updateUserDto);

    return { message: 'User update successfully', user: data };
  }

  @Delete('me')
  async deleteUser(@GetUser() user: string) {
    const data = await this.userService.delete(user);

    return {
      message: 'User delete successfully',
      deletedUser: data,
    };
  }
}
