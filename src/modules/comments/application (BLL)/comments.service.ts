import { CommentsRepository } from '../infrastructure (DAL)/comments.repository';
import {
  CommentsExtendedType,
  CommentsType,
  PostType,
} from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../../posts/infrastructure (DAL)/posts.repository';
import { UsersRepository } from '../../users/infrastructure (DAL)/users.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async getCommentsByPostId(
    pageNumber: string = '1' || undefined || null,
    pageSize: string = '10' || undefined || null,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    postId: string,
  ): Promise<CommentsExtendedType | undefined | null> {
    return this.commentsRepository.getCommentsByPostId(
      +pageNumber,
      +pageSize,
      sortBy,
      sortDirection,
      postId,
    );
  }

  async createCommentByPostId(
    postId: string,
    content: string,
    userId: any,
  ): Promise<CommentsType | undefined> {
    const post = await this.postsRepository.getPostById(postId);
    const user = await this.usersRepository.findUserById(userId);

    debugger;
    if (post) {
      const newComment = {
        postId: postId,
        id: uuidv4(),
        content: content,
        userId,
        userLogin: user.login,
        createdAt: new Date(),
        // likesInfo: {
        //   likesCount: 0,
        //   dislikesCount: 0,
        //   myStatus: 'None',
        // },
      };

      const createdComment = await this.commentsRepository.createComment(
        newComment,
      );
      return createdComment;
    }
  }

  async updateComment(commentId: string, content: string): Promise<boolean> {
    return this.commentsRepository.updateComment(commentId, content);
  }

  async deleteComment(commentId: string): Promise<boolean> {
    return this.commentsRepository.deleteComment(commentId);
  }

  async getCommentById(
    commentId: string,
  ): Promise<CommentsType | undefined | null> {
    return await this.commentsRepository.getCommentById(commentId);
  }
}
