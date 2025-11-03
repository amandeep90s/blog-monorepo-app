import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';

describe('CommentService', () => {
  let service: CommentService;

  const mockComment = {
    id: '1',
    content: 'Test comment',
    postId: 'post-1',
    authorId: 'author-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: 'author-1',
      name: 'Test Author',
      email: 'author@example.com',
      avatar: 'avatar.jpg',
    },
    post: {
      id: 'post-1',
      title: 'Test Post',
      slug: 'test-post',
    },
  };

  const mockPrismaService = {
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCommentInput: CreateCommentInput = {
      content: 'New comment',
      postId: 'post-1',
      authorId: 'author-1',
    };

    it('should create a new comment successfully', async () => {
      mockPrismaService.comment.create.mockResolvedValue(mockComment);

      const result = await service.create(createCommentInput);

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: createCommentInput.content,
          postId: createCommentInput.postId,
          authorId: createCommentInput.authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });
    });

    it('should throw error if creation fails', async () => {
      mockPrismaService.comment.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createCommentInput)).rejects.toThrow(
        'Failed to create comment',
      );
    });
  });

  describe('findAll', () => {
    it('should return all comments', async () => {
      const comments = [mockComment];
      mockPrismaService.comment.findMany.mockResolvedValue(comments);

      const result = await service.findAll();

      expect(result).toEqual(comments);
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

      const result = await service.findOne('1');

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a comment successfully', async () => {
      const updatedComment = { ...mockComment, content: 'Updated content' };
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaService.comment.update.mockResolvedValue(updatedComment);

      const result = await service.update('1', {
        id: '1',
        content: 'Updated content',
      });

      expect(result).toEqual(updatedComment);
      expect(mockPrismaService.comment.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a comment successfully', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      const result = await service.remove('1');

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
