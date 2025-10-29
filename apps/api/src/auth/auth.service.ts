import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInInput } from './dto/signin.input';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateLocalUser({ email, password }: SignInInput) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('User not found');

    const passwordMatched = await verify(user.password, password);

    if (!passwordMatched)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User) {
    // TODO: Implement JWT token generation
  }

  async generateToken() {
    // TODO : Implement token generation logic
  }
}
