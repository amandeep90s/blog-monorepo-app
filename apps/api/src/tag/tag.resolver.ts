import { Args, Resolver } from '@nestjs/graphql';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  // All tag operations are currently unused by the web app
  // Tags are managed through posts creation/update
}
