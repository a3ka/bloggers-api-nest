import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogsDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  createdAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
