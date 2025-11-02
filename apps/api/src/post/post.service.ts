import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostInput: CreatePostInput) {
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
          title: createPostInput.title,
          slug: createPostInput.slug,
          content: createPostInput.content,
          thumbnail: createPostInput.thumbnail,
          published: createPostInput.published ?? false,
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

  async update(id: string, updatePostInput: UpdatePostInput) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID "${id}" not found`);
      }

      // If slug is being updated, check if it's already taken
      if (updatePostInput.slug && updatePostInput.slug !== post.slug) {
        const existingPost = await this.prisma.post.findUnique({
          where: { slug: updatePostInput.slug },
        });

        if (existingPost) {
          throw new ConflictException('A post with this slug already exists');
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...updateData } = updatePostInput;

      return await this.prisma.post.update({
        where: { id },
        data: updateData,
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

  async remove(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID "${id}" not found`);
      }

      await this.prisma.post.delete({
        where: { id },
      });

      return post;
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
    return await this.prisma.post.count({
      where: { published: true },
    });
  }
}
