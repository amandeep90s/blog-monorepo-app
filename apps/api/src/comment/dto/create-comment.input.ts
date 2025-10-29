import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  exampleField: string;
}
