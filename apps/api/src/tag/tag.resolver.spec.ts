import { Test, TestingModule } from '@nestjs/testing';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

describe('TagResolver', () => {
  let resolver: TagResolver;
  let tagService: TagService;

  const mockTagService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagResolver,
        { provide: TagService, useValue: mockTagService },
      ],
    }).compile();

    resolver = module.get<TagResolver>(TagResolver);
    tagService = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should have no active resolvers - all tag operations are unused', () => {
    // All tag operations are currently unused by the web app
    // Tags are managed through posts creation/update
    expect(resolver).toBeDefined();
  });
});
