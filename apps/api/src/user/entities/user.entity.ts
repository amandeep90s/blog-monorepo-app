import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';

@ObjectType()
export class User {
  @Field(() => String, { description: 'User ID' })
  id: string;

  @Field(() => String, { description: 'User Name' })
  name: string;

  @Field(() => String, { description: 'User email' })
  email: string;

  @Field(() => String, { description: 'User bio', nullable: true })
  bio?: string | null;

  @Field(() => String, { description: 'User avatar URL', nullable: true })
  avatar?: string | null;

  @Field(() => Date, { description: 'Account creation date' })
  createdAt: Date;

  @Field(() => Date, { description: 'Account last update date' })
  updatedAt: Date;

  @Field(() => [Post], { description: 'Posts authored by the user' })
  posts?: Post[];

  @Field(() => [Comment], { description: 'Comments made by the user' })
  comments: Comment[];
}
