import { Injectable } from '@nestjs/common';
import { likesStatusCollection, PostsModel } from '../../../db';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostsDocument } from './domain/posts.schema';
import { PostsExtendedType, PostType } from '../../../types/types';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostsDocument>,
  ) {}
  async getAllPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    userId?: string,
    blogId?: string,
  ): Promise<PostsExtendedType | undefined | null> {
    // const postsCount = await PostsModel.count({});
    // const pagesCount = Math.ceil(postsCount / pageSize);
    // const posts: PostType[] | PostType = await PostsModel.find(
    //   {},
    //   {
    //     _id: 0,
    //     __v: 0,
    //   },
    // )
    //   .skip((pageNumber - 1) * pageSize)
    //   .limit(pageSize)
    //   .lean();
    //
    // const result = {
    //   pagesCount: pagesCount,
    //   page: pageNumber,
    //   pageSize,
    //   totalCount: postsCount,
    //   items: posts,
    // };
    //
    // if (!userId) {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   return result;
    // } else {
    //   const likesStatus: LikesStatusType[] | null = await likesStatusCollection
    //     .find({ userId })
    //     .toArray();
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   return [likesStatus, result];
    // }
    let sortDirect;
    if (sortDirection === 'desc') {
      sortDirect = 1;
    } else {
      sortDirect = -1;
    }

    let posts;

    if (blogId) {
      posts = await this.PostModel.find({ blogId }, { _id: 0, __v: 0 })
        .sort({ sortBy: sortDirect })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();
    } else {
      posts = await this.PostModel.find({}, { _id: 0, __v: 0 })
        .sort({ sortBy: sortDirect })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();
    }

    const postsCount = await this.PostModel.count({});
    const pagesCount = Math.ceil(postsCount / pageSize);

    const result = {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return result;
  }

  async createPost(newPost: PostType): Promise<PostType | undefined> {
    await PostsModel.insertMany([newPost]);
    return newPost;
  }

  async getPostById(postId: string, userId?: string) {
    if (!userId) {
      return PostsModel.findOne({ id: postId }, { _id: 0, __v: 0 });
    }

    if (userId) {
      // const likesStatus:LikesStatusType|null = await likesStatusCollection.find({id: postId, userId}).limit(3).toArray() // ?????
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const likesStatus: LikesStatusType | null =
        await likesStatusCollection.findOne({ id: postId, userId });
      const post = await PostsModel.findOne({ id: postId }, { _id: 0, __v: 0 });
      return [likesStatus, post];
    }
  }

  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
  ): Promise<boolean> {
    const result = await PostsModel.updateOne(
      { id: postId },
      { $set: { title, shortDescription, content, bloggerId } },
    );
    return result.matchedCount === 1;
  }

  async deletePost(postId: string): Promise<boolean> {
    const result = await PostsModel.deleteOne({ id: postId });
    return result.deletedCount === 1;
  }

  async deleteAllPosts(): Promise<boolean> {
    const result = await PostsModel.deleteMany({});
    return true;
  }
}
