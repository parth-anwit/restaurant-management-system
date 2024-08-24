import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { ValidMealCategoryGuard } from '../auth/guards/valid-mealCategory.guard';
import { ValidRestaurantGuard } from '../auth/guards/valid-restaurant.guard';

@Controller('meal-category')
@ApiTags('meal-category')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard, ValidRestaurantGuard, ValidMealCategoryGuard)
export class MealManagementController {
  // constructor(private me)
}
