import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'The  name of the user' })
  @Length(2, 100)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { description: 'The email of the user' })
  @IsEmail()
  @Length(5, 255)
  @IsNotEmpty()
  email: string;

  @Field(() => String, { description: 'The password of the user' })
  @Length(8, 50)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field(() => String, { description: 'The bio of the user', nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field(() => String, {
    description: 'The avatar of the user',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
