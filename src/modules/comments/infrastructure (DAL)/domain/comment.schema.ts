import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  postId: string;
  @Prop()
  id: string;
  @Prop()
  content: string;
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
  @Prop()
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
