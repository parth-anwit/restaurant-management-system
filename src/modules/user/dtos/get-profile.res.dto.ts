import { ApiProperty } from '@nestjs/swagger';

import { Types } from 'mongoose';
import { User } from '../user.schema';

export class GetProfileResDto {
  @ApiProperty({
    description: 'Message to the user',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'User details',
    type: User,
  })
  user?: User;

  @ApiProperty({
    type: Types.ObjectId,
  })
  id: Types.ObjectId;

  @ApiProperty({
    type: User,
  })
  email: string;

  @ApiProperty({
    type: User,
  })
  name: string;
}
