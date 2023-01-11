import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttemptDocument = HydratedDocument<Attempt>;

@Schema()
export class Attempt {
  @Prop()
  userIP: string;
  @Prop()
  url: string;
  @Prop()
  time: string;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
