import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

@Module({
  providers: [LikeResolver, LikeService, PrismaService],
})
export class LikeModule {}
