import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TagModule } from './tag.module';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

describe('TagModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TagModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide TagService', () => {
    const tagService = module.get<TagService>(TagService);
    expect(tagService).toBeDefined();
  });

  it('should provide TagResolver', () => {
    const tagResolver = module.get<TagResolver>(TagResolver);
    expect(tagResolver).toBeDefined();
  });
});
