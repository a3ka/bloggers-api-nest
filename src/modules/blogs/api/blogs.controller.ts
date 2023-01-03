import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application BLL/blogs.service';
import { CreateEditBlogDto } from './dto/blog-create-edit.dto';
import { CreateEditPostForBlogDto } from './dto/post-for-blog-create-edit.dto';
import { BasicAuthGuard } from '../../auth/api/guards/basic-auth.guard';
import { PostsService } from '../../posts/application (BLL)/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  async getAllBlogs(
    @Query()
    query: {
      SearchNameTerm: string;
      PageNumber: string;
      PageSize: string;
      SortBy: string;
      SortDirection: string;
    },
  ) {
    const blogs = await this.blogsService.getAllBlogs(
      query.SearchNameTerm,
      query.PageNumber,
      query.PageSize,
      query.SortBy,
      query.SortDirection,
    );
    return blogs;
  }

  // @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(
    @Body() { name, description, websiteUrl }: CreateEditBlogDto,
  ) {
    const newBlog = await this.blogsService.createBlog(
      name,
      description,
      websiteUrl,
    );
    return newBlog;
  }

  @HttpCode(200)
  @Get('/:id')
  async getBlogById(@Param('id') blogId: string) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (blog) {
      return blog;
    } else {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new BadRequestException([
        { message: 'Blog with that Id not found', field: 'blogId' },
      ]);
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put('/:id')
  async updateBlogger(
    @Param('id') blogId: string,
    @Body() { name, description, websiteUrl }: CreateEditBlogDto,
  ) {
    const isUpdated = await this.blogsService.updateBlog(
      blogId,
      name,
      description,
      websiteUrl,
    );

    if (isUpdated) {
      const blog = await this.blogsService.getBlogById(blogId);
      return blog;
    } else {
      throw new BadRequestException([
        { message: 'Blog with that Id not found', field: 'blogId' },
      ]);
    }
  }
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    const isDeleted = await this.blogsService.deleteBlog(blogId);
    if (isDeleted) {
      return true;
    } else {
      throw new BadRequestException([
        { message: 'Blog with that Id not found', field: 'blogId' },
      ]);
    }
  }

  @HttpCode(200)
  @Get('/:id/posts')
  async getPostsOfBlogByItsId(
    @Param('id') blogId: string,
    @Query()
    query: {
      PageNumber: string;
      PageSize: string;
      SortBy: string;
      SortDirection: string;
    },
  ) {
    const posts = await this.postsService.getAllPosts(
      query.PageNumber,
      query.PageSize,
      query.SortBy,
      query.SortDirection,
      blogId,
    );
    if (!posts) {
      {
        throw new BadRequestException([
          { message: 'Blog with that Id not found', field: 'blogId' },
        ]);
      }
    }

    // const posts = await this.blogsService.getPostsOfBlogByItsId(
    //   query.PageNumber,
    //   query.PageSize,
    //   query.SortBy,
    //   query.SortDirection,
    //   blogId,
    // );

    return posts;

    // if(!req.user) {
    //   // @ts-ignore
    //   const posts = await bloggersService.getPostsByBloggerId(req.params.bloggerId, req.query.PageNumber, req.query.PageSize);
    //   res.status(200).send(posts);
    // }
    //
    // if(req.user) {
    //   // @ts-ignore
    //   const posts = await bloggersService.getPostsByBloggerId(req.params.bloggerId, req.query.PageNumber, req.query.PageSize, req.user);
    //   res.status(200).send(posts);
    // }
  }

  @UseGuards(BasicAuthGuard)
  @Post('/:id/posts')
  async createPostForBlogByItsId(
    @Body() { title, shortDescription, content }: CreateEditPostForBlogDto,
    @Param('id') blogId: string,
  ) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new BadRequestException([
        { message: 'Blog with that Id not found', field: 'blogId' },
      ]);
    }
    const newPost = await this.blogsService.createPostForBlogByItsId(
      title,
      shortDescription,
      content,
      blog,
    );

    return newPost;
  }
}
