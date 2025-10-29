import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => String)
  id: string;
}
