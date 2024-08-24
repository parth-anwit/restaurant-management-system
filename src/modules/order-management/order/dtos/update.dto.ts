import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateOrderDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  notes: string;

  @ApiProperty()
  mealCategory_id: Types.ObjectId;

  @ApiProperty()
  meal_id: Types.ObjectId;
}
