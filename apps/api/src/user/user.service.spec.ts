import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    avatar: 'avatar.jpg',
    bio: 'Test bio',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'avatar.jpg',
    bio: 'Test bio',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserInput: CreateUserInput = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'password123',
      avatar: 'avatar.jpg',
    };

    it('should create a new user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.create(createUserInput);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserInput.email },
      });
      expect(argon2.hash).toHaveBeenCalledWith(createUserInput.password);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserInput.email,
          password: 'hashedPassword',
          name: createUserInput.name,
          avatar: createUserInput.avatar,
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createUserInput)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserInput)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [mockUserWithoutPassword];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(
        mockUserWithoutPassword,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(mockUserWithoutPassword);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email without password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(
        mockUserWithoutPassword,
      );

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUserWithoutPassword);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });
});
