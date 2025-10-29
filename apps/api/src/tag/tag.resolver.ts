import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag)
  createTag(@Args('createTagInput') createTagInput: CreateTagInput) {
    return this.tagService.create(createTagInput);
  }

  @Query(() => [Tag], { name: 'tag' })
  findAll() {
    return this.tagService.findAll();
  }

  @Query(() => Tag, { name: 'tag' })
  findOne(@Args('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Mutation(() => Tag)
  updateTag(@Args('updateTagInput') updateTagInput: UpdateTagInput) {
    return this.tagService.update(updateTagInput.id, updateTagInput);
  }

  @Mutation(() => Tag)
  removeTag(@Args('id') id: string) {
    return this.tagService.remove(id);
  }
}
