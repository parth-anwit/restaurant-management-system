import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MealDocument = Meal & Document;
@Schema()
export class Meal {
  @Optional()
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MealCategory' })
  mealCategory: Types.ObjectId;

  @Prop({ required: true })
  money: number;
}

export const mealSchema = SchemaFactory.createForClass(Meal);
