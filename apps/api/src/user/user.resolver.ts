import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { type GraphQLContext } from 'src/common/types/graphql-context.type';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => User, { name: 'userByEmail' })
  findByEmail(@Args('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Query(() => User, { name: 'getCurrentUser' })
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Context() context: GraphQLContext) {
    const userId = context.req.user.id;
    return this.userService.findOne(userId);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Context() context: GraphQLContext,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    const userId = context.req.user.id;
    return this.userService.updateProfile(userId, updateProfileInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }
}
