import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  exampleField: string;
}
