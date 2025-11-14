import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { type GraphQLContext } from 'src/common/types/graphql-context.type';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Context() context: GraphQLContext,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    const userId = context.req.user.id;
    return this.postService.create({ userId, createPostInput });
  }

  @Query(() => [Post], { name: 'posts' })
  findAll(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.postService.findAll({ skip, take });
  }

  @Query(() => Post, { name: 'getPostBySlug' })
  findBySlug(@Args('slug', { type: () => String }) slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Query(() => Int, { name: 'postsCount' })
  count() {
    return this.postService.count();
  }

  @Query(() => Post, { name: 'getPostById' })
  findOne(@Args('id') id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @Context() context: GraphQLContext,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ) {
    const userId = context.req.user.id;
    return this.postService.update({ userId, updatePostInput });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removePost(
    @Context() context: GraphQLContext,
    @Args('postId', { type: () => String }) postId: string,
  ) {
    const userId = context.req.user.id;
    return this.postService.remove({ postId, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post])
  getUserPosts(
    @Context() context: GraphQLContext,
    @Args('skip', { nullable: true, type: () => Int }) skip?: number,
    @Args('take', { nullable: true, type: () => Int }) take?: number,
  ) {
    const userId = context.req.user.id;
    return this.postService.findByUserId({
      userId,
      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Int)
  userPostCount(@Context() context: GraphQLContext) {
    const userId = context.req.user.id;
    return this.postService.userPostCount(userId);
  }
}
