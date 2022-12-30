import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type refreshTokensBLDocument = HydratedDocument<RefreshTokensBL>;

@Schema()
export class RefreshTokensBL {
  @Prop()
  refreshToken: string;
}

export const refreshTokensBLSchema =
  SchemaFactory.createForClass(RefreshTokensBL);
