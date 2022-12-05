import { BlogsExtendedType, BlogType } from '../../../types/types';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure DAL/blogs.repository';
import { BloggersType } from '../../../ts-types';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async getAllBlogs(
    searchNameTerm: string | null = null,
    pageNumber: string = '1' || undefined,
    pageSize: string = '10' || undefined,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  ): Promise<BlogsExtendedType | undefined | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.blogsRepository.getAllBlogs(
      +pageNumber,
      +pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
    );
  }

  async createBlog(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogType> {
    const newBlog = {
      id: (+new Date()).toString(),
      name,
      description,
      websiteUrl,
    };
    const createdBlog = await this.blogsRepository.createBlog(newBlog);
    return createdBlog;
  }

  async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
    const blogger = await this.blogsRepository.getBloggerById(bloggerId);
    return blogger;
  }

  async updateBlogger(
    bloggerId: string,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    return await this.blogsRepository.updateBlogger(
      bloggerId,
      name,
      youtubeUrl,
    );
  }

  async deleteBlogger(bloggerId: string): Promise<boolean> {
    return this.blogsRepository.deleteBlogger(bloggerId);
  }
}
