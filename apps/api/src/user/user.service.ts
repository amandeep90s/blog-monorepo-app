import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { password, email, ...user } = createUserInput;

    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await hash(password);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...user,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
    });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const { password, ...updateData } = updateUserInput;

    const dataToUpdate = { ...updateData } as Record<string, any>;

    // If password is provided, hash it before updating
    if (password) {
      const hashedPassword = await hash(password);
      dataToUpdate['password'] = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
    });
  }

  async updateProfile(id: string, updateProfileInput: UpdateProfileInput) {
    return this.prisma.user.update({
      where: { id },
      data: updateProfileInput,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from the response
      },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
