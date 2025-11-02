import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateLikeInput {
  @Field(() => String, { description: 'ID of the user' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Field(() => String, { description: 'ID of the post' })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
