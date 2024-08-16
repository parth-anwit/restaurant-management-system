import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  location: string;
}
