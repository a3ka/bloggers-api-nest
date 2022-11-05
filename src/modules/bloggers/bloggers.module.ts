import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogger, BloggerSchema } from './domain/blogger.schema';
import { BloggersService } from './application BLL/bloggers.service';
import { BloggersController } from './api/bloggers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogger.name, schema: BloggerSchema }]),
  ],
  controllers: [BloggersController],
  providers: [BloggersService],
})
export class BloggersModule {}
