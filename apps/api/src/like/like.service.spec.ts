import { ConflictException, NotFoundException } from '@nestjs/common';
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
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
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

  describe('likePost', () => {
    const createLikeInput: CreateLikeInput = {
      userId: 'user-1',
      postId: 'post-1',
    };

    it('should like a post successfully', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(null);
      mockPrismaService.like.create.mockResolvedValue(mockLike);

      const result = await service.likePost(createLikeInput);

      expect(result).toEqual(true);
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
      });
    });

    it('should throw ConflictException if like already exists', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(mockLike);

      await expect(service.likePost(createLikeInput)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.likePost(createLikeInput)).rejects.toThrow(
        'You have already liked this post',
      );
      expect(mockPrismaService.like.create).not.toHaveBeenCalled();
    });
  });

  describe('unlikePost', () => {
    const createLikeInput: CreateLikeInput = {
      userId: 'user-1',
      postId: 'post-1',
    };

    it('should unlike a post successfully', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(mockLike);
      mockPrismaService.like.delete.mockResolvedValue(mockLike);

      const result = await service.unlikePost(createLikeInput);

      expect(result).toEqual(true);
      expect(mockPrismaService.like.findUnique).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: createLikeInput.userId,
            postId: createLikeInput.postId,
          },
        },
      });
      expect(mockPrismaService.like.delete).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: createLikeInput.userId,
            postId: createLikeInput.postId,
          },
        },
      });
    });

    it('should throw NotFoundException if like does not exist', async () => {
      mockPrismaService.like.findUnique.mockResolvedValue(null);

      await expect(service.unlikePost(createLikeInput)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.like.delete).not.toHaveBeenCalled();
    });
  });

  describe('getPostLikesCount', () => {
    it('should return the count of likes for a post', async () => {
      mockPrismaService.like.count.mockResolvedValue(5);

      const result = await service.getPostLikesCount('post-1');

      expect(result).toEqual(5);
      expect(mockPrismaService.like.count).toHaveBeenCalledWith({
        where: {
          postId: 'post-1',
        },
      });
    });
  });

  describe('getUserLikedPost', () => {
    const createLikeInput: CreateLikeInput = {
      userId: 'user-1',
      postId: 'post-1',
    };

    it('should return true if user has liked the post', async () => {
      mockPrismaService.like.findFirst.mockResolvedValue(mockLike);

      const result = await service.getUserLikedPost(createLikeInput);

      expect(result).toEqual(true);
      expect(mockPrismaService.like.findFirst).toHaveBeenCalledWith({
        where: {
          postId: createLikeInput.postId,
          userId: createLikeInput.userId,
        },
      });
    });

    it('should return false if user has not liked the post', async () => {
      mockPrismaService.like.findFirst.mockResolvedValue(null);

      const result = await service.getUserLikedPost(createLikeInput);

      expect(result).toEqual(false);
      expect(mockPrismaService.like.findFirst).toHaveBeenCalledWith({
        where: {
          postId: createLikeInput.postId,
          userId: createLikeInput.userId,
        },
      });
    });
  });
});
