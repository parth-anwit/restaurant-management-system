import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MealCategoryDocument = MealCategory & Document;

@Schema()
export class MealCategory {
  @Optional()
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: Types.ObjectId;
}

export const MealCategorySchema = SchemaFactory.createForClass(MealCategory);
