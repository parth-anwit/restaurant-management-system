import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBillDto {
  @ApiProperty()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsNumber()
  total?: number;

  @ApiProperty()
  @IsBoolean()
  isBillGenerated?: boolean;

  @ApiProperty()
  @IsNumber()
  discount?: number;
}
