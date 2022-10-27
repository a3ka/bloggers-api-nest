import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersController } from './modules/bloggers/bloggers.controller';
import { PostsController } from './modules/posts/posts.controller';
import { BloggersService } from './modules/bloggers/bloggers.service';
import { BloggersRepository } from './modules/bloggers/bloggers.repository';
import { PostsService } from './modules/posts/posts.service';
import { PostsRepository } from './modules/posts/posts.repository';

@Module({
  imports: [],
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
