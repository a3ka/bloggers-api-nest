import {
  User,
  UserDocument,
} from '../modules/users/infrastructure (DAL)/domain/users.schema';
import { HydratedDocument, LeanDocument, Query, Types } from 'mongoose';

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
  id?: any;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt?: string;
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
  createdAt: string;
  isConfirmed?: boolean;
  password?: string;
};

export type UsersExtendedType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: [UsersType | UsersType[]];
};

// export type UsersExtendedType = {
//   pagesCount: number;
//   pageSize: number;
//   page: number;
//   totalCount: Query<
//     number,
//     Document &
//       User & { _id: Types.ObjectId } & Required<{ _id: Types.ObjectId }>,
//     {},
//     Document & User & { _id: Types.ObjectId }
//   >;
//   items: Query<
//     LeanDocument<Array<HydratedDocument<UserDocument>>[number]>[],
//     Document &
//       User & { _id: Types.ObjectId } & Required<{ _id: Types.ObjectId }>,
//     {},
//     Document & User & { _id: Types.ObjectId }
//   >;
// };
