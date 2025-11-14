import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikeInput } from './dto/create-like.input';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likePost(createLikeInput: CreateLikeInput) {
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

      const result = await this.prisma.like.create({
        data: {
          userId: createLikeInput.userId,
          postId: createLikeInput.postId,
        },
      });

      return Boolean(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create like: ${errorMessage}`);
    }
  }

  async unlikePost({ userId, postId }: CreateLikeInput) {
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

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to remove like: ${errorMessage}`);
    }
  }

  async getPostLikesCount(postId: string) {
    return await this.prisma.like.count({
      where: {
        postId,
      },
    });
  }

  async getUserLikedPost(createLikeInput: CreateLikeInput) {
    const like = await this.prisma.like.findFirst({
      where: { postId: createLikeInput.postId, userId: createLikeInput.userId },
    });

    return Boolean(like);
  }
}
