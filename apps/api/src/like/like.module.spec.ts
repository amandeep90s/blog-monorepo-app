import { Test, TestingModule } from '@nestjs/testing';
import { LikeModule } from './like.module';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { PrismaService } from '../prisma/prisma.service';

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
