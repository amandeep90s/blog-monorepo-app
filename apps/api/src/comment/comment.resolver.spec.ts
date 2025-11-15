import { Test, TestingModule } from '@nestjs/testing';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

describe('CommentResolver', () => {
  let resolver: CommentResolver;
  let commentService: CommentService;

  const mockComment = {
    id: '1',
    content: 'Test comment',
    postId: 'post-1',
    authorId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'avatar.jpg',
    },
  };

  const mockCommentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByPost: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
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
        CommentResolver,
        { provide: CommentService, useValue: mockCommentService },
      ],
    }).compile();

    resolver = module.get<CommentResolver>(CommentResolver);
    commentService = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getPostComments', () => {
    it('should get comments for a post', () => {
      const postId = 'post-1';
      const take = 10;
      const skip = 0;
      const comments = [mockComment];

      mockCommentService.findOneByPost.mockReturnValue(comments);

      const result = resolver.getPostComments(postId, take, skip);

      expect(result).toEqual(comments);
      expect(commentService.findOneByPost).toHaveBeenCalledWith({
        postId,
        take,
        skip,
      });
    });
  });

  describe('postCommentCount', () => {
    it('should get comment count for a post', () => {
      const postId = 'post-1';
      const count = 5;

      mockCommentService.count.mockReturnValue(count);

      const result = resolver.postCommentCount(postId);

      expect(result).toBe(count);
      expect(commentService.count).toHaveBeenCalledWith(postId);
    });
  });

  describe('createComment', () => {
    it('should create a comment', () => {
      const createCommentInput: CreateCommentInput = {
        content: 'Test comment',
        postId: 'post-1',
      };
      const authorId = 'user-1';

      mockCommentService.create.mockReturnValue(mockComment);

      const result = resolver.createComment(mockContext, createCommentInput);

      expect(result).toEqual(mockComment);
      expect(commentService.create).toHaveBeenCalledWith(
        createCommentInput,
        authorId,
      );
    });
  });

  describe('findAll', () => {
    it('should return all comments', () => {
      const comments = [mockComment];
      mockCommentService.findAll.mockReturnValue(comments);

      const result = resolver.findAll();

      expect(result).toEqual(comments);
      expect(commentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', () => {
      const id = '1';
      mockCommentService.findOne.mockReturnValue(mockComment);

      const result = resolver.findOne(id);

      expect(result).toEqual(mockComment);
      expect(commentService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', () => {
      const updateCommentInput: UpdateCommentInput = {
        id: '1',
        content: 'Updated comment',
      };

      mockCommentService.update.mockReturnValue(mockComment);

      const result = resolver.updateComment(updateCommentInput);

      expect(result).toEqual(mockComment);
      expect(commentService.update).toHaveBeenCalledWith(
        updateCommentInput.id,
        updateCommentInput,
      );
    });
  });

  describe('removeComment', () => {
    it('should remove a comment', () => {
      const id = '1';
      const result = 'Comment removed';
      mockCommentService.remove.mockReturnValue(result);

      expect(resolver.removeComment(id)).toBe(result);
      expect(commentService.remove).toHaveBeenCalledWith(id);
    });
  });
});
