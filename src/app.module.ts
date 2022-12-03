import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersController } from './modules/bloggers/api/bloggers.controller';
import { BloggersService } from './modules/bloggers/application BLL/bloggers.service';
// import { BloggersRepository } from './modules/bloggers/infrastructure DAL/bloggers.repository';
import { BloggersRepository } from './modules/bloggers/infrastructure DAL/bloggers-mongoose.repository';
import { PostsService } from './modules/posts/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blogger,
  BloggerSchema,
} from './modules/bloggers/domain/blogger.schema';
import { PostsController } from './modules/posts/posts.controller';
import { Post, PostsSchema } from './modules/posts/domain/posts.schema';
import { PostsRepository } from './modules/posts/posts-mongoose.repository';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net/socialNetwork',
    ),
    MongooseModule.forFeature([
      { name: Blogger.name, schema: BloggerSchema },
      { name: Post.name, schema: PostsSchema },
    ]),
  ],
  controllers: [AppController, BloggersController, PostsController],
  providers: [
    AppService,
    BloggersService,
    BloggersRepository,
    PostsService,
    PostsRepository,
  ],
})
export class AppModule {}
