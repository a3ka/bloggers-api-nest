import { Injectable } from '@nestjs/common';
import { BloggersExtendedType, BloggersType } from '../../../ts-types';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../domain/blog.schema';
import { Model } from 'mongoose';
import { BlogsExtendedType, BlogType } from '../../../types/types';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogsDocument>,
  ) {}

  async getAllBlogs(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: string,
  ): Promise<BlogsExtendedType | undefined | null> {
    let sortDirect;
    if (sortDirection === 'desc') {
      sortDirect = 1;
    } else {
      sortDirect = -1;
    }

    if (searchNameTerm) {
      const blogs = await this.BlogModel.find(
        { name: { $regex: searchNameTerm } },
        { _id: 0, __v: 0 },
      )
        .sort({ sortBy: sortDirect })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const blogsCount = await this.BlogModel.count({
        name: { $regex: searchNameTerm },
      });
      const pagesCount = Math.ceil(blogsCount / pageSize);

      const result = {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: blogsCount,
        items: blogs,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return result;
    } else {
      // const blogs = await BloggersModel.find({}, {projection: {_id: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
      const blogs = await this.BlogModel.find({}, { _id: 0, __v: 0 })
        .sort({ sortBy: sortDirect })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const blogsCount = await this.BlogModel.count({});
      const pagesCount = Math.ceil(blogsCount / pageSize);

      const result = {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: blogsCount,
        items: blogs,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return result;
    }
  }

  async createBlog(newBlog: BlogType): Promise<BlogType> {
    await this.BlogModel.insertMany([newBlog]);
    const blog = await this.BlogModel.findOne(
      { id: newBlog.id },
      { _id: 0, __v: 0 },
    );
    return blog;
  }

  async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
    const blogger: BloggersType | null = await this.BlogModel.findOne(
      { id: bloggerId },
      { p_id: 0, __v: 0 },
    );
    return blogger;
  }

  async updateBlogger(
    bloggerId: string,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    const result = await this.BlogModel.updateOne(
      { id: bloggerId },
      { $set: { name: name, youtubeUrl: youtubeUrl } },
    );
    return result.matchedCount === 1;
  }

  async deleteBlogger(bloggerId: string): Promise<boolean> {
    const result = await this.BlogModel.deleteOne({ id: bloggerId });
    return result.deletedCount === 1;
  }

  async deleteAllBlogs(): Promise<boolean> {
    const result = await this.BlogModel.deleteMany({});
    return true;
  }
}
