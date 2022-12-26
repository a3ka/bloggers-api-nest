import { Prop } from '@nestjs/mongoose';

export type BlogType = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: Date;
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
  createdAt?: Date;
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
  id?: string;
  login?: string;
  email?: string;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt?: string;
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
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  // createdAt: string;
  isConfirmed?: boolean;
};

export type CommentsType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};

export type CommentsTypeDB = {
  postId: string;
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
};

export type CommentsExtendedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: [CommentsType | CommentsType[]];
};
