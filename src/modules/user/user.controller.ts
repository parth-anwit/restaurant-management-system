// External dependencies
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Logger, Param, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

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
    const { email, name, id } = user;
    return {
      message: 'Profile retrieved successfully',
      id,
      email,
      name,
    };
  }

  @HttpCode(200)
  @Patch('/:userId')
  @UsePipes(new ValidationPipe())
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(userId, updateUserDto);

    return { message: 'User update successfully', user: data };
  }
}
