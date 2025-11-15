import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'avatar.jpg',
    bio: 'Test bio',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleLogin', () => {
    it('should handle Google login endpoint', () => {
      expect(() => controller.googleLogin()).not.toThrow();
    });
  });

  describe('googleCallback', () => {
    it('should handle Google auth callback', async () => {
      const mockRequest = { user: mockUser } as any;
      const mockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      const loginResponse = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: mockUser.avatar,
        bio: mockUser.bio,
        accessToken: 'test-token',
      };

      mockAuthService.login.mockResolvedValue(loginResponse);

      await controller.googleCallback(mockRequest, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:3000/api/google/callback'),
      );
    });

    it('should handle Google callback without avatar', async () => {
      const userWithoutAvatar = { ...mockUser, avatar: null };
      const mockRequest = { user: userWithoutAvatar } as any;
      const mockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      const loginResponse = {
        id: userWithoutAvatar.id,
        name: userWithoutAvatar.name,
        email: userWithoutAvatar.email,
        avatar: null,
        bio: userWithoutAvatar.bio,
        accessToken: 'test-token',
      };

      mockAuthService.login.mockResolvedValue(loginResponse);

      await controller.googleCallback(mockRequest, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(userWithoutAvatar);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.not.stringContaining('&avatar='),
      );
    });
  });

  describe('verify', () => {
    it('should verify token and return ok', () => {
      const result = controller.verify();
      expect(result).toBe('ok');
    });
  });
});
