import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => String, { description: 'Post ID' })
  id: string;

  @Field(() => String, { description: 'Post Title' })
  title: string;

  @Field(() => String, { description: 'Post Slug' })
  slug: string;

  @Field(() => String, { description: 'Post Thumbnail', nullable: true })
  thumbnail?: string;

  @Field(() => String, { description: 'Post Content' })
  content: string;

  @Field(() => Boolean, { description: 'Is the post published?' })
  published: boolean;

  @Field(() => Date, { description: 'Post Creation Date' })
  createdAt: Date;

  @Field(() => Date, { description: 'Post Last Update Date' })
  updatedAt: Date;
}
