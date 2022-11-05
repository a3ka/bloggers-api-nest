import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostType } from '../../ts-types';
import { BloggersRepository } from '../bloggers/infrastructure DAL/bloggers.repository';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected bloggersRepository: BloggersRepository,
  ) {}

  async getAllPosts(
    pageNumber: string = '1' || undefined || null,
    pageSize: string = '10' || undefined || null,
    userId?: string,
  ) {
    if (!userId) {
      const posts = await this.postsRepository.getAllPosts(
        +pageNumber,
        +pageSize,
      );

      if (posts) {
        for (const item of posts.items) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          item.extendedLikesInfo.newestLikes = item.extendedLikesInfo.newestLikes.splice(0, 3);
        }
        return posts;
      } else {
        return false;
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [likesStatus, posts] = await this.postsRepository.getAllPosts(
        +pageNumber,
        +pageSize,
        userId,
      );

      for (const el of posts.items) {
        for (const item of likesStatus) {
          if (item.id === el.id && item.userId === userId) {
            el.extendedLikesInfo.myStatus = item.likeStatus;
          }
        }
      }

      for (const item of posts.items) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        item.extendedLikesInfo.newestLikes =
          item.extendedLikesInfo.newestLikes.splice(0, 3);
      }

      return posts;
    }
  }

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
  ): Promise<PostType | undefined> {
    const blogger = await this.bloggersRepository.getBloggerById(bloggerId);
    if (blogger) {
      const newPost = {
        id: (+new Date()).toString(),
        title,
        shortDescription,
        content,
        bloggerId,
        bloggerName: blogger.name,
        addedAt: new Date,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const createdPost = await this.postsRepository.createPost(newPost);
      return createdPost;
    }
  }

  async getPostById(postId: string, userId?: string) {
    if (!userId) {
      const post = await this.postsRepository.getPostById(postId);

      if (post) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        post.extendedLikesInfo.newestLikes = post.extendedLikesInfo.newestLikes.splice(0, 3);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        post!.extendedLikesInfo.myStatus = 'None';
        return post;
      } else {
        return undefined;
      }
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

      post.extendedLikesInfo.newestLikes =
        post.extendedLikesInfo.newestLikes.splice(0, 3);
      post!.extendedLikesInfo.myStatus = likesStatus.likeStatus;
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
