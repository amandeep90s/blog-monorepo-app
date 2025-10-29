import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @Field(() => String, { description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
