import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Content of the comment' })
  @MaxLength(500)
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field(() => String, { description: 'ID of the post' })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
