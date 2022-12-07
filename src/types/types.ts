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
