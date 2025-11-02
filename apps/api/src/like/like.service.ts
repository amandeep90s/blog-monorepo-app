import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeInput: CreateLikeInput) {
    try {
      // Check if like already exists
      const existingLike = await this.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: createLikeInput.userId,
            postId: createLikeInput.postId,
          },
        },
      });

      if (existingLike) {
        throw new ConflictException('You have already liked this post');
      }

      return await this.prisma.like.create({
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
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create like: ${errorMessage}`);
    }
  }

  async findAll() {
    return await this.prisma.like.findMany({
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
  }

  async findOne(id: string) {
    const like = await this.prisma.like.findUnique({
      where: { id },
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

    if (!like) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }

    return like;
  }

  async findByPostId(postId: string) {
    return await this.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async countByPostId(postId: string) {
    return await this.prisma.like.count({
      where: { postId },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_id: string, _updateLikeInput: UpdateLikeInput) {
    // Likes typically don't need to be updated
    // They are either created or deleted
    throw new Error('Likes cannot be updated. Please delete and recreate.');
  }

  async remove(id: string) {
    try {
      const like = await this.prisma.like.findUnique({
        where: { id },
      });

      if (!like) {
        throw new NotFoundException(`Like with ID ${id} not found`);
      }

      await this.prisma.like.delete({
        where: { id },
      });

      return like;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete like: ${errorMessage}`);
    }
  }

  async removeByUserAndPost(userId: string, postId: string) {
    try {
      const like = await this.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (!like) {
        throw new NotFoundException('Like not found');
      }

      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      return like;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to remove like: ${errorMessage}`);
    }
  }
}
