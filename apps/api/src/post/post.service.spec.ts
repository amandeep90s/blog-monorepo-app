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
      tags: ['tag1', 'tag2'],
    };

    it('should create a new post successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);
      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create({
        userId: 'author-1',
        createPostInput,
      });

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
          author: {
            connect: {
              id: 'author-1',
            },
          },
          tags: {
            connectOrCreate: createPostInput.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
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

      await expect(
        service.create({
          userId: 'author-1',
          createPostInput,
        }),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.create({
          userId: 'author-1',
          createPostInput,
        }),
      ).rejects.toThrow('A post with this slug already exists');
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
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
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
      const postWithComments = { ...mockPost, comments: [], likes: [] };
      mockPrismaService.post.findUnique.mockResolvedValue(postWithComments);

      const result = await service.findBySlug('test-post');

      expect(result).toEqual(postWithComments);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'test-post' },
        }),
      );
    });

    it('should throw NotFoundException if post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        'Post with slug "non-existent" not found',
      );
    });
  });

  describe('update', () => {
    const updatePostInput: UpdatePostInput = {
      id: '1',
      title: 'Updated Title',
      published: false,
      tags: ['tag1'],
    };

    it('should update a post successfully', async () => {
      const updatedPost = { ...mockPost, ...updatePostInput };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue(updatedPost);

      const result = await service.update({
        userId: 'author-1',
        updatePostInput,
      });

      expect(result).toEqual(updatedPost);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: updatePostInput.id, authorId: 'author-1' },
      });
      expect(mockPrismaService.post.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a post successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.remove({
        postId: '1',
        userId: 'author-1',
      });

      expect(result).toEqual(true);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: '1', authorId: 'author-1' },
      });
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: '1', authorId: 'author-1' },
      });
    });
  });
});
