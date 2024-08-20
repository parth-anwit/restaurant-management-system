import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMealCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}
