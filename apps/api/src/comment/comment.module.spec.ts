import { Test, TestingModule } from '@nestjs/testing';
import { CommentModule } from './comment.module';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PrismaService } from '../prisma/prisma.service';

describe('CommentModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CommentModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CommentService', () => {
    const commentService = module.get<CommentService>(CommentService);
    expect(commentService).toBeDefined();
  });

  it('should provide CommentResolver', () => {
    const commentResolver = module.get<CommentResolver>(CommentResolver);
    expect(commentResolver).toBeDefined();
  });
});
