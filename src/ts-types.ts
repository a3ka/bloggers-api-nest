import { NewestLikesType } from "./types/types";

export type BloggersType = {
  id: string;
  name: string;
  youtubeUrl: string;
};

export type BloggersExtendedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: [BloggersType | BloggersType[]];
};

export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: object; // new
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: [NewestLikesType | NewestLikesType[]];
  };
};

export type UsersType = {
  id?: string;
  login?: string;
  isConfirmed?: boolean;
  email?: string;
  password?: string;
};

export type UsersEmailConfDataType = {
  email: string;
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type CommentType = {
  postId: string;
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: object;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export type AttemptType = {
  userIP: string;
  url: string;
  time: Date;
};

export type RefreshTokensCollectionType = {
  refreshToken: string;
};

export type LikesStatusType = {
  id: string;
  userId: string;
  likeStatus: 'None' | 'Like' | 'Dislike';
};
