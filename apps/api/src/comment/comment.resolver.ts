import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.create(createCommentInput);
  }

  @Query(() => [Comment], { name: 'comment' })
  findAll() {
    return this.commentService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentService.update(
      updateCommentInput.id,
      updateCommentInput,
    );
  }

  @Mutation(() => Comment)
  removeComment(@Args('id') id: string) {
    return this.commentService.remove(id);
  }
}
