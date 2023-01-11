import { Prop } from '@nestjs/mongoose';
import add from 'date-fns/add';

export type BlogType = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
};

export type BlogsExtendedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: [BlogType | BlogType[]];
};

export type PostType = {
  id?: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt?: string;
  // createdAt?: string;
};

export type PostsExtendedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: [PostType | PostType[]];
};

export type UsersType = {
  userId?: string;
  id?: string;
  login: string;
  email?: string;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt?: string;
  // createdAt: string;
  isConfirmed?: boolean;
};

export type UsersExtendedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: [UsersType | UsersType[]];
};

export type UserDBType = {
  accountData: {
    id: string;
    login: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    isConfirmed: boolean;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
  };
};

export type CommentsType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};

export type CommentsTypeDB = {
  postId: string;
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};

export type CommentsExtendedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: [CommentsType | CommentsType[]];
};

export type TokenPairType = {
  accessToken: string;
  refreshToken: string;
};

export type SessionType = {
  userId?: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export type AttemptType = {
  userIP: string;
  url: string;
  time: Date;
};
