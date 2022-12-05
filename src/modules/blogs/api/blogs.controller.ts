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
  @Get('/:bloggerId')
  // async getBloggerById(@Param('bloggerId', ParseIntPipe) bloggerId: number) {
  async getBloggerById(@Param('bloggerId') bloggerId: string) {
    const blogger = await this.blogsService.getBloggerById(bloggerId);

    if (blogger) {
      return blogger;
    } else {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new BadRequestException([
        { message: 'Blogger with that Id not found', field: 'bloggerId' },
      ]);
    }
  }

  @HttpCode(204)
  @Put('/:bloggerId')
  async updateBlogger(
    @Param('bloggerId') bloggerId: string,
    @Body() { name, websiteUrl }: CreateEditBlogDto,
  ) {
    const isUpdated = await this.blogsService.updateBlogger(
      bloggerId,
      name,
      websiteUrl,
    );

    if (isUpdated) {
      const blogger = await this.blogsService.getBloggerById(bloggerId);
      return blogger;
    } else {
      throw new BadRequestException([
        { message: 'Blogger with that Id not found', field: 'bloggerId' },
      ]);
    }
  }

  @HttpCode(204)
  @Delete(':bloggerId')
  async deleteUser(@Param('bloggerId') bloggerId: string) {
    const isDeleted = await this.blogsService.deleteBlogger(bloggerId);
    if (isDeleted) {
      return true;
    } else {
      throw new BadRequestException([
        { message: 'Blogger with that Id not found', field: 'bloggerId' },
      ]);
    }
  }
}
