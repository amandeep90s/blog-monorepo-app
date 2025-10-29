import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  create(createTagInput: CreateTagInput) {
    return 'This action adds a new tag';
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: string) {
    return `This action returns a #${id} tag`;
  }

  update(id: string, updateTagInput: UpdateTagInput) {
    return `This action updates a #${id} tag`;
  }

  remove(id: string) {
    return `This action removes a #${id} tag`;
  }
}
