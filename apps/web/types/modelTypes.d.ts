// Post, User, Tag, and Comment model types

export type Post = {
  id: string;
  title: string;
  slug: string | null;
  author: User;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: string;
  tags?: Tag[];
  createdAt: Date;
  updatedAt: Date;
  _count: {
    likes: number;
    comments: number;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
};

export type Comment = {
  id: string;
  content: string;
  post: Post;
  author: User;
  createdAt: Date;
  updatedAt: Date;
};
