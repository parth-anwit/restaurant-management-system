import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { ResourceService } from './resource.service';
import { ValidRestaurantGuard } from '../auth/guards/valid-restaurant.guard';

@ApiTags('resource')
@ApiSecurity('JWT-auth')
@Controller('resource')
@UseGuards(JwtAuthGuard)
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @UseGuards(ValidRestaurantGuard)
  @Delete('restaurant/:restaurantId')
  async deleteRestaurantSubPart(@Param() restaurantId: string) {
    const data = await this.resourceService.deleteRestaurantSubPart(restaurantId);
    return data;
  }

  @Delete('user/:userId')
  async deleteUserSubPart(@Param() userId: string) {
    const data = await this.resourceService.deleteUserSubPart(userId);
    return data;
  }
}
