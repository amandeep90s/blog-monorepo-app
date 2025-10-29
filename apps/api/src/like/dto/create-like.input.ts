import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLikeInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  exampleField: string;
}
