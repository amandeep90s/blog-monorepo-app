import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { LikeModule } from './like.module';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

describe('LikeModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [LikeModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide LikeService', () => {
    const likeService = module.get<LikeService>(LikeService);
    expect(likeService).toBeDefined();
  });

  it('should provide LikeResolver', () => {
    const likeResolver = module.get<LikeResolver>(LikeResolver);
    expect(likeResolver).toBeDefined();
  });
});
