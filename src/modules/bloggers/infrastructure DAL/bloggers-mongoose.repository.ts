import { Injectable } from '@nestjs/common';
import { BloggersExtendedType, BloggersType } from '../../../ts-types';
import { InjectModel } from '@nestjs/mongoose';
import { Blogger, BloggersDocument } from '../domain/blogger.schema';
import { Model } from 'mongoose';

@Injectable()
export class BloggersRepository {
  constructor(
    @InjectModel(Blogger.name) private BloggerModel: Model<BloggersDocument>,
  ) {}

  async getAllBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string | null,
  ): Promise<BloggersExtendedType | undefined | null> {
    if (searchNameTerm) {
      const bloggers = await this.BloggerModel.find(
        { name: { $regex: searchNameTerm } },
        { _id: 0, __v: 0 },
      )
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const bloggersCount = await this.BloggerModel.count({
        name: { $regex: searchNameTerm },
      });
      const pagesCount = Math.ceil(bloggersCount / pageSize);

      const result = {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: bloggersCount,
        items: bloggers,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return result;
    } else {
      // const bloggers = await BloggersModel.find({}, {projection: {_id: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
      const bloggers = await this.BloggerModel.find({}, { _id: 0, __v: 0 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const bloggersCount = await this.BloggerModel.count({});
      const pagesCount = Math.ceil(bloggersCount / pageSize);

      const result = {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: bloggersCount,
        items: bloggers,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return result;
    }
  }
  async createBlogger(newBlogger: BloggersType): Promise<BloggersType> {
    await this.BloggerModel.insertMany([newBlogger]);
    const blogger = await this.BloggerModel.findOne(
      { id: newBlogger.id },
      { _id: 0, __v: 0 },
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return blogger;
  }
  async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
    const blogger: BloggersType | null = await this.BloggerModel.findOne(
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
    const result = await this.BloggerModel.updateOne(
      { id: bloggerId },
      { $set: { name: name, youtubeUrl: youtubeUrl } },
    );
    return result.matchedCount === 1;
  }
  async deleteBlogger(bloggerId: string): Promise<boolean> {
    const result = await this.BloggerModel.deleteOne({ id: bloggerId });
    return result.deletedCount === 1;
  }
}
