import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { SignInInput } from './dto/signin.input';
import { AuthJwtPayload } from './types/auth-jwtPaylod';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateLocalUser({ email, password }: SignInInput) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('User not found');

    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    const passwordMatched = await verify(user.password, password);

    if (!passwordMatched)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User) {
    const { id, name, email, avatar } = user;
    const { accessToken } = await this.generateToken(id);

    return { id, name, email, avatar, accessToken };
  }

  async generateToken(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async validateJwtUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = { id: user.id };

    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserInput) {
    const isUserExist = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (isUserExist) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...authUser } = isUserExist;
      return authUser;
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        password: googleUser.password,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...authUser } = newUser;

    return authUser;
  }
}
