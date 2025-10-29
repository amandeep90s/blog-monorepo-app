import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';

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

  @Field(() => [Comment], { description: 'Comments made on the post' })
  comments: Comment[];

  @Field(() => User, { description: 'Author of the post' })
  author: User;

  @Field(() => [Tag], { description: 'Tags associated with the post' })
  tags: Tag[];
}
