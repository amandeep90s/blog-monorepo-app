import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field(() => String, { description: 'User ID' })
  id: string;

  @Field(() => String, { description: 'User email' })
  name: string;

  @Field(() => String, { description: 'User avatar', nullable: true })
  avatar?: string;

  @Field(() => String, { description: 'JWT access token' })
  accessToken: string;
}
