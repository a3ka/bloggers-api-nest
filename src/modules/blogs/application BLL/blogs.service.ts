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

  async getBlogById(blogId: string): Promise<BlogType | null> {
    const blog = await this.blogsRepository.getBlogById(blogId);
    return blog;
  }

  async updateBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    return await this.blogsRepository.updateBlog(
      blogId,
      name,
      description,
      websiteUrl,
    );
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(blogId);
  }
}
