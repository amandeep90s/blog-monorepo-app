import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'avatar.jpg',
    bio: 'Test bio',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    updateProfile: jest.fn(),
    remove: jest.fn(),
  };

  const mockContext = {
    req: {
      user: {
        id: 'user-1',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      mockUserService.create.mockResolvedValue(mockUser);

      const result = await resolver.createUser(createUserInput);

      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe('findAll', () => {
    it('should return all users', () => {
      const users = [mockUser];
      mockUserService.findAll.mockReturnValue(users);

      const result = resolver.findAll();

      expect(result).toEqual(users);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const id = '1';
      mockUserService.findOne.mockReturnValue(mockUser);

      const result = resolver.findOne(id);

      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', () => {
      const email = 'test@example.com';
      mockUserService.findByEmail.mockReturnValue(mockUser);

      const result = resolver.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      const userId = 'user-1';
      mockUserService.findOne.mockReturnValue(mockUser);

      const result = resolver.getCurrentUser(mockContext);

      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUser', () => {
    it('should update a user', () => {
      const updateUserInput: UpdateUserInput = {
        id: '1',
        name: 'Updated User',
      };
      mockUserService.update.mockReturnValue(mockUser);

      const result = resolver.updateUser(updateUserInput);

      expect(result).toEqual(mockUser);
      expect(userService.update).toHaveBeenCalledWith(
        updateUserInput.id,
        updateUserInput,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', () => {
      const updateProfileInput: UpdateProfileInput = {
        name: 'Updated Name',
        bio: 'Updated bio',
      };
      const userId = 'user-1';
      mockUserService.updateProfile.mockReturnValue(mockUser);

      const result = resolver.updateProfile(mockContext, updateProfileInput);

      expect(result).toEqual(mockUser);
      expect(userService.updateProfile).toHaveBeenCalledWith(
        userId,
        updateProfileInput,
      );
    });
  });

  describe('removeUser', () => {
    it('should remove a user', () => {
      const id = '1';
      const result = 'User removed';
      mockUserService.remove.mockReturnValue(result);

      expect(resolver.removeUser(id)).toEqual(result);
      expect(userService.remove).toHaveBeenCalledWith(id);
    });
  });
});
