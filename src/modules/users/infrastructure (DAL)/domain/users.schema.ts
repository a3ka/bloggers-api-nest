import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type UserUnconfirmedDocument = HydratedDocument<UserUnconfirmed>;

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

//---------------------------------------------------------------
@Schema()
export class AccountData {
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

@Schema()
export class EmailConfirmation {
  @Prop()
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
}

@Schema()
export class UserUnconfirmed {
  @Prop()
  accountData: AccountData;
  @Prop()
  emailConfirmation: EmailConfirmation;
}

export const UsersUnconfirmedSchema =
  SchemaFactory.createForClass(UserUnconfirmed);
