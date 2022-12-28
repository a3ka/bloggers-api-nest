import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './domain/comment.schema';
import {
  CommentsExtendedType,
  CommentsType,
  CommentsTypeDB,
  PostType,
} from '../../../types/types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
  ) {}

  async getCommentsByPostId(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    postId: string,
  ): Promise<CommentsExtendedType | undefined | null> {
    let sortDirect;
    if (sortDirection === 'desc') {
      sortDirect = 1;
    } else {
      sortDirect = -1;
    }

    const comments = await this.CommentModel.find(
      { postId },
      { _id: 0, __v: 0 },
    )
      .sort({ sortBy: sortDirect })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const commentCount = await this.CommentModel.count({ postId });
    const pagesCount = Math.ceil(commentCount / pageSize);

    const result = {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: commentCount,
      items: comments,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return result;
  }

  async createComment(
    newComment: CommentsTypeDB,
  ): Promise<CommentsType | undefined> {
    await this.CommentModel.insertMany([newComment]);
    const comment = await this.CommentModel.findOne(
      { id: newComment.id },
      { _id: 0, postId: 0, __v: 0 },
    );
    return comment;
  }

  async updateComment(commentId: string, content: string): Promise<boolean> {
    const result = await this.CommentModel.updateOne(
      { id: commentId },
      { $set: { content } },
    );
    return result.matchedCount === 1;
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const result = await this.CommentModel.deleteOne({ id: commentId });
    return result.deletedCount === 1;
  }

  async getCommentById(commentId: string): Promise<CommentsType | undefined> {
    const comment = await this.CommentModel.findOne(
      { id: commentId },
      { _id: 0, postId: 0, __v: 0 },
    );
    return comment;
  }
}
