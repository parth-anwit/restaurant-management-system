import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { MealCategoryService } from '../../meal-management/meal-category/meal-category.service';

@Injectable()
export class ValidMealCategoryGuard implements CanActivate {
  constructor(private mealCatService: MealCategoryService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const restaurantId = request.headers.restaurant_id;
    if (!restaurantId) {
      throw new UnauthorizedException();
    }
    const mealCategory_id = request.params.mealCategoryId;

    if (!mealCategory_id) {
      throw new HttpException('mealCategoryId  not found', 404);
    }

    const data = await this.mealCatService.getSpecific(restaurantId, mealCategory_id);

    if (!data) {
      throw new HttpException('mealCategory is not valid', 404);
    }
    return true;
  }
}
