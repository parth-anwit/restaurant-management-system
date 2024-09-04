import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Meal } from '../../meal-management/meal/meal.schema';

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
  meal: Types.ObjectId | Meal;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bill' })
  bill: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  notes: string;

  @Prop()
  orderPlacedTime: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
