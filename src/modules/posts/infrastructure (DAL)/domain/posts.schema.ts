import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// export type PostsDocument = HydratedDocument<Post>;
export type PostsDocument = Post & Document;

// @Schema()
// class NewestLikes {
//   @Prop()
//   createdAt: string;
//   @Prop()
//   userId: string;
//   @Prop()
//   login: string;
// }
//
// const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);
//
// @Schema()
// class ExtendedLikesInfo {
//   @Prop()
//   likesCount: number;
//   @Prop()
//   dislikesCount: number;
//   @Prop()
//   myStatus: string;
//   @Prop({ type: [NewestLikesSchema] })
//   newestLikes: NewestLikes[];
// }

@Schema()
export class Post {
  @Prop()
  id: string;
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  blogId: string;
  @Prop()
  blogName: string;
  @Prop()
  createdAt: Date;
  // @Prop({ type: ExtendedLikesInfo })
  // extendedLikesInfo: ExtendedLikesInfo;
}

export const PostsSchema = SchemaFactory.createForClass(Post);
