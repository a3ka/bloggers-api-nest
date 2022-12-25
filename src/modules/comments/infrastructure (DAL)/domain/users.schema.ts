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
  email: string;
  @Prop()
  passwordHash: string;
  @Prop()
  passwordSalt: string;
  @Prop()
  createdAt: string;
  @Prop()
  isConfirmed: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(User);
