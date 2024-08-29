import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Optional } from '@nestjs/common';

import { Customer } from '../../customer-management/customer/customer.schema';

export type BillDocument = Bill & Document;

@Schema()
export class Bill {
  @Optional()
  _id?: Types.ObjectId;

  @Optional()
  @Prop({ default: '' })
  title?: string;

  name: {
    first: string;
    last: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Types.ObjectId | Customer;

  @Optional()
  @Prop()
  total?: number;

  @Prop()
  startTime: Date;

  @Optional()
  @Prop()
  endTime?: Date;

  @Prop({ default: false })
  isBillGenerated: boolean;

  @Prop()
  discount: number;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
