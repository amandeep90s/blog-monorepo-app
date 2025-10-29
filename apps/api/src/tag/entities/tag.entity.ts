import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';

@ObjectType()
export class Tag {
  @Field(() => String, { description: 'Tag ID' })
  id: string;

  @Field(() => String, { description: 'Name of the tag' })
  name: string;

  @Field(() => [Post], { description: 'Posts associated with the tag' })
  posts: Post[];
}
