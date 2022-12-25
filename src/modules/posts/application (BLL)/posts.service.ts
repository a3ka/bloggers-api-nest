import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure (DAL)/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure DAL/blogs.repository';
import {
  BlogsExtendedType,
  PostType,
  PostsExtendedType,
} from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected bloggersRepository: BlogsRepository,
  ) {}

  async getAllPosts(
    pageNumber: string = '1' || undefined || null,
    pageSize: string = '10' || undefined || null,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    blogId?: string,
    userId?: string,
  ): Promise<PostsExtendedType | undefined | null> {
    // if (!userId) {
    //   const posts = await this.postsRepository.getAllPosts(
    //     +pageNumber,
    //     +pageSize,
    //   );
    //
    //   if (posts) {
    //     for (const item of posts.items) {
    //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //       // @ts-ignore
    //       item.extendedLikesInfo.newestLikes =
    //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //         // @ts-ignore
    //         item.extendedLikesInfo.newestLikes.splice(0, 3);
    //     }
    //     return posts;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   const [likesStatus, posts] = await this.postsRepository.getAllPosts(
    //     +pageNumber,
    //     +pageSize,
    //     userId,
    //   );
    //   for (const el of posts.items) {
    //     for (const item of likesStatus) {
    //       if (item.id === el.id && item.userId === userId) {
    //         el.extendedLikesInfo.myStatus = item.likeStatus;
    //       }
    //     }
    //   }
    //   for (const item of posts.items) {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     item.extendedLikesInfo.newestLikes =
    //       item.extendedLikesInfo.newestLikes.splice(0, 3);
    //   }
    //   return posts;
    // }
    //-----------------------

    // if (blogId) {
    //   return this.postsRepository.getAllPosts(
    //     +pageNumber,
    //     +pageSize,
    //     sortBy,
    //     sortDirection,
    //   );
    // }

    return this.postsRepository.getAllPosts(
      +pageNumber,
      +pageSize,
      sortBy,
      sortDirection,
      blogId,
      userId,
    );
  }

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): Promise<PostType | undefined> {
    const newPost = {
      id: uuidv4(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date(),
      // createdAt: (+new Date()).toString(),
      // extendedLikesInfo: {
      //   likesCount: 0,
      //   dislikesCount: 0,
      //   myStatus: 'None',
      //   newestLikes: [],
      // },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const createdPost = await this.postsRepository.createPost(newPost);
    return createdPost;
  }

  async getPostById(
    postId: string,
    userId?: string,
  ): Promise<PostType | undefined | null> {
    if (!userId) {
      const post = await this.postsRepository.getPostById(postId);
      return post;

      // if (post) {
      //   post.extendedLikesInfo.newestLikes =
      //     post.extendedLikesInfo.newestLikes.splice(0, 3);
      //   post!.extendedLikesInfo.myStatus = 'None';
      //   return post;
      // } else {
      //   return undefined;
      // }
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [likesStatus, post] = await this.postsRepository.getPostById(
        postId,
        userId,
      );

      if (!post) {
        return undefined;
      }

      if (!likesStatus) {
        return post;
      }

      // post.extendedLikesInfo.newestLikes =
      //   post.extendedLikesInfo.newestLikes.splice(0, 3);
      // post!.extendedLikesInfo.myStatus = likesStatus.likeStatus;
      return post;
    }
  }

  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
  ): Promise<boolean> {
    return this.postsRepository.updatePost(
      postId,
      title,
      shortDescription,
      content,
      bloggerId,
    );
  }

  async deletePost(postId: string): Promise<boolean> {
    return this.postsRepository.deletePost(postId);
  }
}
