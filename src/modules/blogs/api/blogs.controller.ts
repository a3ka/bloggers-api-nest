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
} from '@nestjs/common';
import { BlogsService } from '../application BLL/blogs.service';
import { CreateEditBlogDto } from '../application BLL/dto/blog-create-edit.dto';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}

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

  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') blogId: string) {
    const isDeleted = await this.blogsService.deleteBlog(blogId);
    if (isDeleted) {
      return true;
    } else {
      throw new BadRequestException([
        { message: 'Blog with that Id not found', field: 'blogId' },
      ]);
    }
  }
}
