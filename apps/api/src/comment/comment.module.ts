import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  providers: [CommentResolver, CommentService, PrismaService],
})
export class CommentModule {}
