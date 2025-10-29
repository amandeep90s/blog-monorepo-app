import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTagInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  exampleField: string;
}
