import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from './user.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide UserService', () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeDefined();
  });

  it('should provide UserResolver', () => {
    const userResolver = module.get<UserResolver>(UserResolver);
    expect(userResolver).toBeDefined();
  });
});
