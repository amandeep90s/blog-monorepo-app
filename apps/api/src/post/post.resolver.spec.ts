/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

describe('PostResolver', () => {
  let resolver: PostResolver;
  let postService: PostService;

  const mockPost = {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    content: 'Test content',
    thumbnail: 'thumbnail.jpg',
    published: true,
    authorId: 'author-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: 'author-1',
      name: 'Test Author',
      email: 'author@example.com',
      avatar: 'avatar.jpg',
    },
    tags: [],
  };

  const mockPostService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findBySlug: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostResolver,
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    resolver = module.get<PostResolver>(PostResolver);
    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createPost', () => {
    const createPostInput: CreatePostInput = {
      title: 'New Post',
      slug: 'new-post',
      content: 'Post content',
      thumbnail: 'thumbnail.jpg',
      published: true,
      authorId: 'author-1',
    };

    const mockContext = {
      req: {
        user: {
          id: 'user-1',
        },
      },
    };

    it('should create a new post', async () => {
      mockPostService.create.mockResolvedValue(mockPost);

      const result = await resolver.createPost(mockContext, createPostInput);

      expect(result).toEqual(mockPost);
      expect(postService.create).toHaveBeenCalledWith({
        userId: 'user-1',
        createPostInput,
      });
    });
  });

  describe('findAll', () => {
    it('should return all posts with default pagination', async () => {
      const posts = [mockPost];
      mockPostService.findAll.mockResolvedValue(posts);

      const result = await resolver.findAll();

      expect(result).toEqual(posts);
      expect(postService.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
      });
    });

    it('should return all posts with custom pagination', async () => {
      const posts = [mockPost];
      mockPostService.findAll.mockResolvedValue(posts);

      const result = await resolver.findAll(10, 5);

      expect(result).toEqual(posts);
      expect(postService.findAll).toHaveBeenCalledWith({
        skip: 10,
        take: 5,
      });
    });
  });

  describe('findBySlug', () => {
    it('should return a post by slug', async () => {
      mockPostService.findBySlug.mockResolvedValue(mockPost);

      const result = await resolver.findBySlug('test-post');

      expect(result).toEqual(mockPost);
      expect(postService.findBySlug).toHaveBeenCalledWith('test-post');
    });
  });

  describe('count', () => {
    it('should return posts count', async () => {
      mockPostService.count.mockResolvedValue(10);

      const result = await resolver.count();

      expect(result).toBe(10);
      expect(postService.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockPostService.findOne.mockResolvedValue(mockPost);

      const result = await resolver.findOne('1');

      expect(result).toEqual(mockPost);
      expect(postService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updatePost', () => {
    const updatePostInput: UpdatePostInput = {
      id: '1',
      title: 'Updated Title',
    };

    const mockContext = {
      req: {
        user: {
          id: 'user-1',
        },
      },
    };

    it('should update a post', async () => {
      const updatedPost = { ...mockPost, ...updatePostInput };
      mockPostService.update.mockResolvedValue(updatedPost);

      const result = await resolver.updatePost(mockContext, updatePostInput);

      expect(result).toEqual(updatedPost);
      expect(postService.update).toHaveBeenCalledWith({
        userId: 'user-1',
        updatePostInput,
      });
    });
  });

  describe('removePost', () => {
    const mockContext = {
      req: {
        user: {
          id: 'user-1',
        },
      },
    };

    it('should delete a post', async () => {
      mockPostService.remove.mockResolvedValue(true);

      const result = await resolver.removePost(mockContext, '1');

      expect(result).toBe(true);
      expect(postService.remove).toHaveBeenCalledWith({
        postId: '1',
        userId: 'user-1',
      });
    });
  });
});
