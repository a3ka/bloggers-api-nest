import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BloggersDocument = Blogger & Document;

@Schema()
export class Blogger {
  @Prop()
  id: string;

  @Prop()
  name: number;

  @Prop()
  youtubeUrl: string;
}

export const BloggerSchema = SchemaFactory.createForClass(Blogger);
