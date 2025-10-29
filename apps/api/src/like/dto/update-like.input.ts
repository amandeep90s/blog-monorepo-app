import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateLikeInput } from './create-like.input';

@InputType()
export class UpdateLikeInput extends PartialType(CreateLikeInput) {
  @Field(() => String)
  id: string;
}
