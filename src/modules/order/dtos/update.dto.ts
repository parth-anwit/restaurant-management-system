import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  notes: string;

  @ApiProperty()
  mealCategory_id: string;

  @ApiProperty()
  meal_id: string;
}
