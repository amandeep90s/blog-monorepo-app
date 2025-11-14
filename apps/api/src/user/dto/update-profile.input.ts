import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { description: 'The name of the user', nullable: true })
  @IsOptional()
  @Length(2, 100)
  @IsString()
  name?: string;

  @Field(() => String, { description: 'The bio of the user', nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;
}
