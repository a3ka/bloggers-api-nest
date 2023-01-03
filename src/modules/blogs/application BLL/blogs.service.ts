import {
  BlogsExtendedType,
  BlogType,
  PostsExtendedType,
  PostType,
} from '../../../types/types';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure DAL/blogs.repository';
import { v4 as uuidv4 } from 'uuid';
import { PostsRepository } from '../../posts/infrastructure (DAL)/posts.repository';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
  ) {}

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
      id: uuidv4(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      // createdAt: (+new Date()).toString(),
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

  async createPostForBlogByItsId(
    title: string,
    shortDescription: string,
    content: string,
    blog: BlogType,
  ): Promise<PostType> {
    const newPost = {
      id: uuidv4(),
      title,
      shortDescription,
      content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      // createdAt: (+new Date()).toString(),
    };

    const createdPost = await this.postsRepository.createPost(newPost);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return createdPost;
  }

  async getPostsOfBlogByItsId(
    blogId: string,
    pageNumber: string = '1' || undefined || null,
    pageSize: string = '10' || undefined || null,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  ): Promise<PostsExtendedType | null> {
    const posts = this.postsRepository.getAllPosts(
      +pageNumber,
      +pageSize,
      sortBy,
      sortDirection,
      blogId,
    );
    return posts;
  }
}
