import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { CreateEditBloggersDto } from './dto/bloggers.dto';

@Controller('bloggers')
export class BloggersController {
  constructor(protected bloggersService: BloggersService) {}

  @Get()
  async getAllBloggers(
    @Query()
    query: {
      PageNumber: string;
      PageSize: string;
      SearchNameTerm: string;
    },
  ) {
    const bloggers = await this.bloggersService.getAllBloggers(
      query.PageNumber,
      query.PageSize,
      query.SearchNameTerm,
    );
    return bloggers;
  }

  @Post()
  async createBlogger(@Body() { name, youtubeUrl }: CreateEditBloggersDto) {
    const newBlogger = await this.bloggersService.createBlogger(
      name,
      youtubeUrl,
    );
    return newBlogger;
  }

  @HttpCode(200)
  @Get('/:bloggerId')
  // async getBloggerById(@Param('bloggerId', ParseIntPipe) bloggerId: number) {
  async getBloggerById(@Param('bloggerId') bloggerId: string) {
    const blogger = await this.bloggersService.getBloggerById(bloggerId);

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
    @Body() { name, youtubeUrl }: CreateEditBloggersDto,
  ) {
    const isUpdated = await this.bloggersService.updateBlogger(
      bloggerId,
      name,
      youtubeUrl,
    );

    if (isUpdated) {
      const blogger = await this.bloggersService.getBloggerById(bloggerId);
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
    const isDeleted = await this.bloggersService.deleteBlogger(bloggerId);
    if (isDeleted) {
      return true;
    } else {
      throw new BadRequestException([
        { message: 'Blogger with that Id not found', field: 'bloggerId' },
      ]);
    }
  }
}
