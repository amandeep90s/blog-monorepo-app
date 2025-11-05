import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Content of the comment' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field(() => String, { description: 'ID of the post' })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
