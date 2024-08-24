import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  mobile: number;
}
