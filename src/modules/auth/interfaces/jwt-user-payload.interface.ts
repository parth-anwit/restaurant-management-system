import { Types } from 'mongoose';

export interface JwtUserPayload {
  id: Types.ObjectId;
  name: string;
  email: string;
  code: number;
}
