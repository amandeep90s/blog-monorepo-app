import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLikeInput } from './dto/create-like.input';
import { LikeService } from './like.service';

describe('LikeService', () => {
  let service: LikeService;

  const mockLike = {
    id: '1',
    userId: 'user-1',
    postId: 'post-1',
    createdAt: new Date(),
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'user@example.com',
      avatar: 'avatar.jpg',
    },
    post: {
      id: 'post-1',
      title: 'Test Post',
      slug: 'test-post',
    },
  };

  const mockPrismaService = {
    like: {
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
        LikeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createLikeInput: CreateLikeInput = {
      userId: 'user-1',
      postId: 'post-1',
    };

    it('should create a new like successfully', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(null);
      mockPrismaService.like.create.mockResolvedValue(mockLike);

      const result = await service.create(createLikeInput);

      expect(result).toEqual(mockLike);
      expect(mockPrismaService.like.findUnique).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: createLikeInput.userId,
            postId: createLikeInput.postId,
          },
        },
      });
      expect(mockPrismaService.like.create).toHaveBeenCalledWith({
        data: {
          userId: createLikeInput.userId,
          postId: createLikeInput.postId,
        },
        include: {
          user: {
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

    it('should throw ConflictException if like already exists', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(mockLike);

      await expect(service.create(createLikeInput)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createLikeInput)).rejects.toThrow(
        'You have already liked this post',
      );
      expect(mockPrismaService.like.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all likes', async () => {
      const likes = [mockLike];
      mockPrismaService.like.findMany.mockResolvedValue(likes);

      const result = await service.findAll();

      expect(result).toEqual(likes);
      expect(mockPrismaService.like.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a like by id', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(mockLike);

      const result = await service.findOne('1');

      expect(result).toEqual(mockLike);
      expect(mockPrismaService.like.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
        }),
      );
    });
  });

  describe('remove', () => {
    it('should delete a like successfully', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(mockLike);
      mockPrismaService.like.delete.mockResolvedValue(mockLike);

      const result = await service.remove('1');

      expect(result).toEqual(mockLike);
      expect(mockPrismaService.like.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
