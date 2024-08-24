import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AccessDocument = Access & Document;

@Schema()
export class Access {
  @Optional()
  _id?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;

  @Prop({ required: true })
  role: string;
}

export const accessSchema = SchemaFactory.createForClass(Access);
