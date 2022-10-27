import { UsersExtendedType, UsersType } from '../../types/types';
import { Injectable } from '@nestjs/common';
import { BloggersRepository } from './bloggers.repository';
import { BloggersType } from '../../ts-types';

@Injectable()
export class BloggersService {
  constructor(protected bloggersRepository: BloggersRepository) {}

  async getAllBloggers(
    pageNumber: string = '1' || undefined,
    pageSize: string = '10' || undefined,
    searchNameTerm: string | null = null,
  ): Promise<UsersExtendedType | undefined | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.bloggersRepository.getAllBloggers(+pageNumber, +pageSize);
  }

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
    const newBlogger = {
      id: (+new Date()).toString(),
      name,
      youtubeUrl,
    };
    const createdBlogger = await this.bloggersRepository.createBlogger(
      newBlogger,
    );
    return createdBlogger;
  }

  async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
    const blogger = await this.bloggersRepository.getBloggerById(bloggerId);
    return blogger;
  }

  async updateBlogger(
    bloggerId: string,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    return await this.bloggersRepository.updateBlogger(
      bloggerId,
      name,
      youtubeUrl,
    );
  }

  async deleteBlogger(bloggerId: string): Promise<boolean> {
    return this.bloggersRepository.deleteBlogger(bloggerId);
  }
}
