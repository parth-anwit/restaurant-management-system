import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { CreateRestaurantDto } from './dtos/createDto';

import { UpdateRestaurantDto } from './dtos/updateDto';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { RestaurantService } from './restaurant.service';
import { UserDocument } from '../user/user.schema';
import { ValidRestaurantGuard } from '../auth/guards/valid-restaurant.guard';

@Controller('restaurant')
@ApiTags('Restaurant')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard)
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @HttpCode(200)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@GetUser() currentUser: UserDocument, @Body() createRestaurantDto: CreateRestaurantDto) {
    const data = this.restaurantService.create(currentUser, createRestaurantDto);
    return data;
  }

  @HttpCode(200)
  @Get()
  async get(@GetUser() currentUser: UserDocument) {
    const restaurant = await this.restaurantService.get(currentUser);
    return restaurant;
  }

  @HttpCode(200)
  @Get('list')
  async getList(@GetUser() currentUser: UserDocument, @Query('page') page: string, @Query('pageSize') pageSize: string) {
    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 50;

    const restaurant = await this.restaurantService.getList(currentUser, pageNum, pageSizeNum);

    return {
      success: true,
      restaurant: {
        metaData: {
          totalCount: restaurant.totalCount,
          page: pageNum,
          pageSize: pageSizeNum,
        },
        data: restaurant.data,
      },
    };
  }

  @HttpCode(200)
  @UseGuards(ValidRestaurantGuard)
  @Get(':restaurantId')
  async getSpecific(@Param('restaurantId') restaurantId: string) {
    const data = await this.restaurantService.getSpecificRestaurant(restaurantId);
    return data;
  }

  @HttpCode(200)
  @UseGuards(ValidRestaurantGuard)
  @Patch(':restaurantId')
  @UsePipes(new ValidationPipe())
  async update(@Param('restaurantId') restaurantId: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    const data = await this.restaurantService.update(restaurantId, updateRestaurantDto);
    return data;
  }
}
