import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AccessDocument = Access & Document;

@Schema()
export class Access {
  @Prop({ type: SchemaTypes.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  restaurantId: Types.ObjectId;

  @Prop({ required: true })
  role: string;
}

export const accessSchema = SchemaFactory.createForClass(Access);
