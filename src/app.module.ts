import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { BlogsService } from './modules/blogs/application BLL/blogs.service';
// import { BloggersRepository } from './modules/blogs/infrastructure DAL/blogs.repository';
import { BlogsRepository } from './modules/blogs/infrastructure DAL/blogs.repository';
import { PostsService } from './modules/posts/application (BLL)/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './modules/blogs/domain/blog.schema';
import { PostsController } from './modules/posts/api/posts.controller';
import { Post, PostsSchema } from './modules/posts/domain/posts.schema';
import { PostsRepository } from './modules/posts/infrastructure (DAL)/posts.repository';
import { TestingController } from './modules/testing/testing.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net/socialNetwork',
    ),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostsSchema },
    ]),
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    TestingController,
  ],
  providers: [
    AppService,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
  ],
})
export class AppModule {}
