import { Injectable, NotFoundException } from '@nestjs/common';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findOneByPost({
    postId,
    take,
    skip,
  }: {
    postId: string;
    take?: number;
    skip?: number;
  }) {
    return await this.prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
    });
  }

  async create(createCommentInput: CreateCommentInput, authorId: string) {
    try {
      return await this.prisma.comment.create({
        data: {
          content: createCommentInput.content,
          post: {
            connect: {
              id: createCommentInput.postId,
            },
          },
          author: {
            connect: {
              id: authorId,
            },
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
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create comment: ${errorMessage}`);
    }
  }

  async count(postId: string) {
    return await this.prisma.comment.count({
      where: {
        postId,
      },
    });
  }

  async findAll() {
    return await this.prisma.comment.findMany({
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
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
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
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async findByPostId(postId: string) {
    return await this.prisma.comment.findMany({
      where: { postId },
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
    });
  }

  async update(id: string, updateCommentInput: UpdateCommentInput) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }

      return await this.prisma.comment.update({
        where: { id },
        data: updateCommentInput,
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
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update comment: ${errorMessage}`);
    }
  }

  async remove(id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }

      await this.prisma.comment.delete({
        where: { id },
      });

      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete comment: ${errorMessage}`);
    }
  }
}
