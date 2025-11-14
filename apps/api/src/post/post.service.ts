import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create({
    userId,
    createPostInput,
  }: {
    userId: string;
    createPostInput: CreatePostInput;
  }) {
    try {
      // Check if slug already exists
      const existingPost = await this.prisma.post.findUnique({
        where: { slug: createPostInput.slug },
      });

      if (existingPost) {
        throw new ConflictException('A post with this slug already exists');
      }

      return await this.prisma.post.create({
        data: {
          ...createPostInput,
          author: {
            connect: {
              id: userId,
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
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create post: ${errorMessage}`);
    }
  }

  async findAll({
    skip = 0,
    take = DEFAULT_PAGE_SIZE,
  }: {
    skip?: number;
    take?: number;
  }) {
    return await this.prisma.post.findMany({
      skip,
      take,
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
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
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
        comments: {
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
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
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
        comments: {
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
        },
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return post;
  }

  async update({
    userId,
    updatePostInput,
  }: {
    userId: string;
    updatePostInput: UpdatePostInput;
  }) {
    try {
      const authorIdMatched = await this.prisma.post.findUnique({
        where: { id: updatePostInput.id, authorId: userId },
      });

      if (!authorIdMatched) {
        throw new UnauthorizedException(
          'You are not authorized to update this post',
        );
      }

      // If slug is being updated, check if it's already taken
      if (
        updatePostInput.slug &&
        updatePostInput.slug !== authorIdMatched.slug
      ) {
        const existingPost = await this.prisma.post.findUnique({
          where: { slug: updatePostInput.slug },
        });

        if (existingPost) {
          throw new ConflictException('A post with this slug already exists');
        }
      }

      const { id, ...data } = updatePostInput;

      return await this.prisma.post.update({
        where: { id },
        data: {
          ...data,
          tags: {
            set: [],
            connectOrCreate:
              updatePostInput.tags?.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })) || [],
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
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update post: ${errorMessage}`);
    }
  }

  async remove({ postId, userId }: { postId: string; userId: string }) {
    try {
      const authorIdMatched = await this.prisma.post.findUnique({
        where: { id: postId, authorId: userId },
      });

      if (!authorIdMatched) {
        throw new UnauthorizedException(
          'You are not authorized to delete this post',
        );
      }

      const result = await this.prisma.post.delete({
        where: { id: postId, authorId: userId },
      });

      return !!result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete post: ${errorMessage}`);
    }
  }

  async count() {
    return await this.prisma.post.count();
  }

  async findByUserId({
    userId,
    skip,
    take,
  }: {
    userId: string;
    skip: number;
    take: number;
  }) {
    return await this.prisma.post.findMany({
      where: {
        author: {
          id: userId,
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        published: true,
        slug: true,
        title: true,
        thumbnail: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      take,
      skip,
    });
  }

  async userPostCount(userId: string) {
    return await this.prisma.post.count({
      where: {
        authorId: userId,
      },
    });
  }
}
