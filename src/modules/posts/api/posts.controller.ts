import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from '../application (BLL)/posts.service';
import { BlogsService } from '../../blogs/application BLL/blogs.service';
import { CreatePostDTO } from './dto/posts.dto';
import { BasicAuthGuard } from '../../auth/api/guards/basic-auth.guard';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { CommentsService } from '../../comments/application (BLL)/comments.service';
import { CreateCommentDTO } from '../../comments/api/dto/comment.dto';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected bloggersService: BlogsService,
    protected commentsService: CommentsService,
    protected usersRepository: UsersRepository,
  ) {}

  @Get()
  async getAllPosts(
    @Query()
    query: {
      PageNumber: string;
      PageSize: string;
      SortBy;
      SortDirection;
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
      query.SortBy,
      query.SortDirection,
    );
    return posts;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(
    @Body()
    { title, shortDescription, content, blogId }: CreatePostDTO,
  ) {
    const blog = await this.bloggersService.getBlogById(blogId);
    if (!blog) {
      //400
      throw new BadRequestException({
        errorsMessages: [
          { message: 'Problem with a blogId field', field: 'blogId' },
        ],
      });
    }

    const newPost = await this.postsService.createPost(
      title,
      shortDescription,
      content,
      blogId,
      blog.name,
    );

    if (!newPost) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'Problem with a blogId field', field: 'blogId' },
        ],
      });
    }
    return newPost;
  }

  @HttpCode(200)
  @Get('/:postId')
  async getPostById(
    @Param('postId') postId: string,
    // @Headers('authorization') authorization: string,
  ) {
    if (typeof postId !== 'string') {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'PostId is not a string', field: 'postId' },
        ],
      });
    }

    // const auth = authorization;
    // if (!auth) {
    //   const post = await this.postsService.getPostById(postId);
    //
    //   if (post) {
    //     return post;
    //   } else {
    //     //404
    //     // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    //     throw new BadRequestException([
    //       { message: 'Post with that Id was not found', field: 'postId' },
    //     ]);
    //   }
    // }
    //
    // if (auth) {
    //   const token = auth.split(' ')[1];
    //   const userId = await this.authService.getUserIdByToken(token);
    //   const post = await this.postsService.getPostById(postId, userId);
    //   if (post) {
    //     return post;
    //   } else {
    //     //404
    //     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    //   }
    // }

    const post = await this.postsService.getPostById(postId);

    if (post) {
      return post;
    } else {
      throw new BadRequestException([
        { message: 'Post with that Id not found', field: 'postId' },
      ]);
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put('/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() { title, shortDescription, content, blogId }: CreatePostDTO,
  ) {
    const blog = await this.bloggersService.getBlogById(blogId);

    if (!blog) {
      //400
      throw new BadRequestException({
        errorsMessages: [
          { message: 'Problem with a blogId field', field: 'blogId' },
        ],
      });
    }

    const updatedPost = await this.postsService.updatePost(
      postId,
      title,
      shortDescription,
      content,
      blogId,
    );

    if (updatedPost) {
      const blogPost = await this.postsService.getPostById(postId);
      return blogPost;
    } else {
      //404
      throw new BadRequestException([
        { message: 'Post with that Id was not found', field: 'postId' },
      ]);
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    const deletedPost = await this.postsService.deletePost(postId);

    if (deletedPost) {
      return true;
    } else {
      //404
      throw new BadRequestException([
        { message: 'Post with that Id was not found', field: 'postId' },
      ]);
    }
  }

  @HttpCode(200)
  @Get('/:postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query()
    query: {
      PageNumber: string;
      PageSize: string;
      SortBy: string;
      SortDirection: string;
    },
  ) {
    if (typeof postId !== 'string') {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'PostId is not a string', field: 'postId' },
        ],
      });
    }

    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new BadRequestException([
        { message: 'Post with that Id not found', field: 'postId' },
      ]);
    }

    const comments = await this.commentsService.getCommentsByPostId(
      query.PageNumber,
      query.PageSize,
      query.SortBy,
      query.SortDirection,
      postId,
    );

    return comments;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @Body()
    { content }: CreateCommentDTO,
    @Request() req,
  ) {
    debugger;
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      {
        throw new BadRequestException([
          { message: 'Post with that Id not found', field: 'postId' },
        ]);
      }
    }

    const userId = await this.usersRepository.findUserById(req.user.id);

    const newComment = await this.commentsService.createCommentByPostId(
      postId,
      content,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userId._doc.id,
    );

    return newComment;
  }
}
