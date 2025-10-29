import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => String, { description: 'Comment ID' })
  id: string;

  @Field(() => String, { description: 'Content of the comment' })
  content: string;

  @Field(() => User, { description: 'User who authored the comment' })
  author: User;

  @Field(() => Post, { description: 'Post the comment belongs to' })
  post: Post;

  @Field(() => Date, { description: 'Timestamp when the comment was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Timestamp when the comment was last updated',
  })
  updatedAt: Date;
}
