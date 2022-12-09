import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;
  @Prop()
  login: string;
  @Prop()
  password: string;
  @Prop()
  isConfirmed: boolean;
  @Prop()
  email: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);