import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;

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

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPostInput: CreatePostInput = {
      title: 'New Post',
      slug: 'new-post',
      content: 'Post content',
      thumbnail: 'thumbnail.jpg',
      published: true,
      authorId: 'author-1',
    };

    it('should create a new post successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);
      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create(createPostInput);

      expect(result).toEqual(mockPost);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { slug: createPostInput.slug },
      });
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: createPostInput.title,
          slug: createPostInput.slug,
          content: createPostInput.content,
          thumbnail: createPostInput.thumbnail,
          published: createPostInput.published,
          authorId: createPostInput.authorId,
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
          tags: true,
        },
      });
    });

    it('should throw ConflictException if slug already exists', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      await expect(service.create(createPostInput)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createPostInput)).rejects.toThrow(
        'A post with this slug already exists',
      );
      expect(mockPrismaService.post.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all published posts with default pagination', async () => {
      const posts = [mockPost];
      mockPrismaService.post.findMany.mockResolvedValue(posts);

      const result = await service.findAll({});

      expect(result).toEqual(posts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: DEFAULT_PAGE_SIZE,
        where: { published: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          tags: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return posts with custom pagination', async () => {
      const posts = [mockPost];
      mockPrismaService.post.findMany.mockResolvedValue(posts);

      const result = await service.findAll({ skip: 10, take: 5 });

      expect(result).toEqual(posts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 5,
        }),
      );
    });
  });

  describe('findBySlug', () => {
    it('should return post by slug', async () => {
      const postWithComments = { ...mockPost, comments: [] };
      mockPrismaService.post.findUnique.mockResolvedValue(postWithComments);

      const result = await service.findBySlug('test-post');

      expect(result).toEqual(postWithComments);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'test-post' },
        }),
      );
    });

    it('should return null if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      const result = await service.findBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updatePostInput: UpdatePostInput = {
      id: '1',
      title: 'Updated Title',
      published: false,
    };

    it('should update a post successfully', async () => {
      const updatedPost = { ...mockPost, ...updatePostInput };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue(updatedPost);

      const result = await service.update(updatePostInput.id, updatePostInput);

      expect(result).toEqual(updatedPost);
      expect(mockPrismaService.post.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a post successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.remove('1');

      expect(result).toEqual(mockPost);
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
