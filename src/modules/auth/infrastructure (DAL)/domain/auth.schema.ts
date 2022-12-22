import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
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

export const AuthSchema = SchemaFactory.createForClass(Auth);
