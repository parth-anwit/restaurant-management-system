import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Optional()
  _id?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MealCategory' })
  mealCategory: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Meal' })
  meal: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bill' })
  bill: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
