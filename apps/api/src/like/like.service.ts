import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  create(createLikeInput: CreateLikeInput) {
    return 'This action adds a new like';
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: string) {
    return `This action returns a #${id} like`;
  }

  update(id: string, updateLikeInput: UpdateLikeInput) {
    return `This action updates a #${id} like`;
  }

  remove(id: string) {
    return `This action removes a #${id} like`;
  }
}
