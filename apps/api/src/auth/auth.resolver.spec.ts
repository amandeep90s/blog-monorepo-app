/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signin.input';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

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

  const mockAuthPayload = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'avatar.jpg',
    accessToken: 'mock.jwt.token',
  };

  const mockAuthService = {
    validateLocalUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signIn', () => {
    const signInInput: SignInInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should sign in user and return auth payload', async () => {
      mockAuthService.validateLocalUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockAuthPayload);

      const result = await resolver.signIn(signInInput);

      expect(result).toEqual(mockAuthPayload);
      expect(authService.validateLocalUser).toHaveBeenCalledWith(signInInput);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
