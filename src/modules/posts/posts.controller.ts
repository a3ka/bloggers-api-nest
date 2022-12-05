import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { jwtService } from '../../jwt-service';
import { BlogsService } from '../blogs/application BLL/blogs.service';
import { CreatePostDTO } from './dto/posts.dto';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected bloggersService: BlogsService,
  ) {}

  @Get()
  async getAllPosts(
    @Query()
    query: {
      PageNumber: string;
      PageSize: string;
    },
  ) {
    // if (req.user) {
    //   const posts = await this.postsService.getAllPosts(
    //     query.PageNumber,
    //     query.PageSize,
    //     req.user,
    //   );
    //   return posts;
    // } else {
    //   const posts = await this.postsService.getAllPosts(
    //     query.PageNumber,
    //     query.PageSize,
    //   );

    const posts = await this.postsService.getAllPosts(
      query.PageNumber,
      query.PageSize,
    );
    return posts;
  }

  @Post()
  async createPost(
    @Body() { title, shortDescription, content, bloggerId }: CreatePostDTO,
  ) {
    const newPost = await this.postsService.createPost(
      title,
      shortDescription,
      content,
      bloggerId,
    );

    if (!newPost) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'Problem with a bloggerId field', field: 'bloggerId' },
        ],
      });
    }
    return newPost;
  }

  @HttpCode(200)
  @Get('/:postId')
  async getBloggerById(
    @Param('postId') postId: string,
    @Headers('authorization') authorization: string,
  ) {
    if (typeof postId !== 'string') {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'PostId is not a string', field: 'postId' },
        ],
      });
    }

    const auth = authorization;
    if (!auth) {
      const post = await this.postsService.getPostById(postId);

      if (post) {
        return post;
      } else {
        //404
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        throw new BadRequestException([
          { message: 'Post with that Id was not found', field: 'postId' },
        ]);
      }
    }

    if (auth) {
      const token = auth.split(' ')[1];
      const userId = await jwtService.getUserIdByToken(token);
      const post = await this.postsService.getPostById(postId, userId);
      if (post) {
        return post;
      } else {
        //404
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
    }
  }

  @HttpCode(204)
  @Put('/:postId')
  async updateBlogger(
    @Param('postId') postId: string,
    @Body() { title, shortDescription, content, bloggerId }: CreatePostDTO,
  ) {
    const blogger = await this.bloggersService.getBloggerById(bloggerId);

    if (!blogger) {
      //400
      throw new BadRequestException({
        errorsMessages: [
          { message: 'Problem with a bloggerId field', field: 'bloggerId' },
        ],
      });
    }

    const isUpdated = await this.postsService.updatePost(
      postId,
      title,
      shortDescription,
      content,
      bloggerId,
    );

    if (isUpdated) {
      const blogPost = await this.postsService.getPostById(postId);
      return blogPost;
    } else {
      //404
      throw new BadRequestException([
        { message: 'Post with that Id was not found', field: 'postId' },
      ]);
    }
  }

  @HttpCode(204)
  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    const isDeleted = await this.postsService.deletePost(postId);

    if (isDeleted) {
      return true;
    } else {
      //404
      throw new BadRequestException([
        { message: 'Post with that Id was not found', field: 'postId' },
      ]);
    }
  }
}
