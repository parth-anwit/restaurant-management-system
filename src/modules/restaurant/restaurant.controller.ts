import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { User } from '../user/user.schema';

import { CreateRestaurantDto } from './dtos/createDto';

import { UpdateRestaurantDto } from './dtos/updateDto';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { RestaurantService } from './restaurant.service';
import { ValidRestaurantGuard } from '../auth/guards/valid-restaurant.guard';

@Controller('restaurant')
@ApiTags('Restaurant')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard)
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createRestaurantDto: CreateRestaurantDto, @GetUser() user: User) {
    const data = this.restaurantService.create(createRestaurantDto, user);
    return data;
  }

  @UseGuards(ValidRestaurantGuard)
  @Get()
  async get() {
    const data = await this.restaurantService.get();
    return data;
  }

  @UseGuards(ValidRestaurantGuard)
  @Get(':id')
  async getSpecific(@Param('id') id: string) {
    const data = await this.restaurantService.getSpecificRestaurant(id);
    return data;
  }

  @UseGuards(ValidRestaurantGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') res_id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    const data = await this.restaurantService.update(res_id, updateRestaurantDto);
    return data;
  }

  @UseGuards(ValidRestaurantGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.restaurantService.delete(id);
    return data;
  }
}
