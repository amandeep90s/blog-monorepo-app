import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { type GraphQLContext } from 'src/common/types/graphql-context.type';
import { Like } from './entities/like.entity';
import { LikeService } from './like.service';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async likePost(
    @Context() context: GraphQLContext,
    @Args('postId', { type: () => String }) postId: string,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.likePost({ postId, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async unlikePost(
    @Context() context: GraphQLContext,
    @Args('postId', { type: () => String }) postId: string,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.unlikePost({ postId, userId });
  }

  @Query(() => Int)
  getPostLikesCount(@Args('postId', { type: () => String }) postId: string) {
    return this.likeService.getPostLikesCount(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  getUserLikedPost(
    @Context() context: GraphQLContext,
    @Args('postId', { type: () => String }) postId: string,
  ) {
    const userId = context.req.user.id;
    return this.likeService.getUserLikedPost({ postId, userId });
  }
}
