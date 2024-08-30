import { BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

export function idChecker(id: string) {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new BadRequestException('Invalid ID format');
  }
}
