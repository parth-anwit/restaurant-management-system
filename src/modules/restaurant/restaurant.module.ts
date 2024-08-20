import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessModule } from '../access/access.module';

import { Restaurant, RestaurantSchema } from './restaurant.schema';
import { RestaurantController } from './restaurant.controller';
import { RestaurantRepository } from './restaurant.repository';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }]), AccessModule],
  providers: [RestaurantService, RestaurantRepository],
  controllers: [RestaurantController],
  exports: [RestaurantService, RestaurantRepository],
})
export class RestaurantModule {}
