import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signin.input';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    avatar: 'avatar.jpg',
    bio: 'Test bio',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateLocalUser', () => {
    const signInInput: SignInInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should validate user with correct credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);

      const result = await service.validateLocalUser(signInInput);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: signInInput.email },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.validateLocalUser(signInInput)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateLocalUser(signInInput)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(service.validateLocalUser(signInInput)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateLocalUser(signInInput)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('login', () => {
    it('should return user data with access token', async () => {
      const accessToken = 'mock.jwt.token';
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: mockUser.avatar,
        accessToken,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
      });
    });
  });

  describe('generateToken', () => {
    it('should generate JWT token for user', async () => {
      const userId = '1';
      const accessToken = 'mock.jwt.token';
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.generateToken(userId);

      expect(result).toEqual({ accessToken });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: userId });
    });
  });

  describe('validateJwtUser', () => {
    it('should return user if valid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateJwtUser(mockUser.id);

      expect(result).toEqual({ id: mockUser.id });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.validateJwtUser('invalid-id')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateJwtUser('invalid-id')).rejects.toThrow(
        'User not found!',
      );
    });
  });

  describe('validateGoogleUser', () => {
    const googleUser = {
      email: 'google@example.com',
      name: 'Google User',
      avatar: 'google-avatar.jpg',
      password: 'hashedPassword',
    };

    it('should return existing user if found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = mockUser;
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateGoogleUser(googleUser);

      expect(result).toEqual(userWithoutPassword);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should create new user if not found', async () => {
      const newUser = { ...mockUser, email: googleUser.email };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = newUser;

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(newUser);

      const result = await service.validateGoogleUser(googleUser);

      expect(result).toEqual(userWithoutPassword);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: googleUser,
      });
    });
  });
});
