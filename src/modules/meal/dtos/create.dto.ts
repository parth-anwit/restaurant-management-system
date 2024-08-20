import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMealDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  mealCategory_id: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  money: number;
}
