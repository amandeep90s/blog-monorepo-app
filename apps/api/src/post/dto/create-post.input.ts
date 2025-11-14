import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Title of the post' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => String, { description: 'Unique slug for the post' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Field(() => String, { description: 'Content of the post' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field(() => String, { nullable: true, description: 'Thumbnail image URL' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsString({ each: true })
  @Field(() => [String], { description: 'Tags associated with the post' })
  tags: string[];

  @Field(() => Boolean, {
    nullable: true,
    description: 'Publication status',
    defaultValue: false,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
