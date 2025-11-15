import { Test, TestingModule } from '@nestjs/testing';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

describe('LikeResolver', () => {
  let resolver: LikeResolver;
  let likeService: LikeService;

  const mockLikeService = {
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    getPostLikesCount: jest.fn(),
    getUserLikedPost: jest.fn(),
  };

  const mockContext = {
    req: {
      user: {
        id: 'user-1',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeResolver,
        { provide: LikeService, useValue: mockLikeService },
      ],
    }).compile();

    resolver = module.get<LikeResolver>(LikeResolver);
    likeService = module.get<LikeService>(LikeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('likePost', () => {
    it('should like a post', async () => {
      const postId = 'post-1';
      const userId = 'user-1';
      const result = true;

      mockLikeService.likePost.mockResolvedValue(result);

      expect(await resolver.likePost(mockContext, postId)).toBe(result);
      expect(likeService.likePost).toHaveBeenCalledWith({ userId, postId });
    });
  });

  describe('unlikePost', () => {
    it('should unlike a post', async () => {
      const postId = 'post-1';
      const userId = 'user-1';
      const result = true;

      mockLikeService.unlikePost.mockResolvedValue(result);

      expect(await resolver.unlikePost(mockContext, postId)).toBe(result);
      expect(likeService.unlikePost).toHaveBeenCalledWith({ userId, postId });
    });
  });

  describe('getPostLikesCount', () => {
    it('should get post likes count', () => {
      const postId = 'post-1';
      const count = 5;

      mockLikeService.getPostLikesCount.mockReturnValue(count);

      expect(resolver.getPostLikesCount(postId)).toBe(count);
      expect(likeService.getPostLikesCount).toHaveBeenCalledWith(postId);
    });
  });

  describe('getUserLikedPost', () => {
    it('should check if user liked a post', () => {
      const postId = 'post-1';
      const userId = 'user-1';
      const result = true;

      mockLikeService.getUserLikedPost.mockReturnValue(result);

      expect(resolver.getUserLikedPost(mockContext, postId)).toBe(result);
      expect(likeService.getUserLikedPost).toHaveBeenCalledWith({
        postId,
        userId,
      });
    });
  });
});
