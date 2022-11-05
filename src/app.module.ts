import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersController } from './modules/bloggers/api/bloggers.controller';
import { PostsController } from './modules/posts/posts.controller';
import { BloggersService } from './modules/bloggers/application BLL/bloggers.service';
// import { BloggersRepository } from './modules/bloggers/infrastructure DAL/bloggers.repository';
import { BloggersRepository } from './modules/bloggers/infrastructure DAL/bloggers-mongoose.repository';
import { PostsService } from './modules/posts/posts.service';
import { PostsRepository } from './modules/posts/posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersModule } from './modules/bloggers/bloggers.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:5000/bloggers'),
    BloggersModule,
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
