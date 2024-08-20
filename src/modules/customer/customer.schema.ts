import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CustomerDocument = Customer & Document;
@Schema()
export class Customer {
  @Optional()
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mobile: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
