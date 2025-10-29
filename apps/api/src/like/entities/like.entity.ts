import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Like {
  @Field(() => String, { description: 'Like ID' })
  id: string;

  @Field(() => User, { description: 'User who liked the post' })
  user: User;

  @Field(() => Post, { description: 'Post that was liked' })
  post: Post;

  @Field(() => Date, { description: 'Timestamp when the like was created' })
  createdAt: Date;
}
