import { Test, TestingModule } from '@nestjs/testing';
import { PostModule } from './post.module';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '../prisma/prisma.service';

describe('PostModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PostModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide PostService', () => {
    const postService = module.get<PostService>(PostService);
    expect(postService).toBeDefined();
  });

  it('should provide PostResolver', () => {
    const postResolver = module.get<PostResolver>(PostResolver);
    expect(postResolver).toBeDefined();
  });
});
