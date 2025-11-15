import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/graphql - Users', () => {
    const createUserMutation = `
      mutation CreateUser($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
          id
          name
          email
        }
      }
    `;

    const usersQuery = `
      query Users {
        users {
          id
          name
          email
        }
      }
    `;

    const userQuery = `
      query User($id: String!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `;

    it('should create a new user', () => {
      const randomEmail = `test-${Date.now()}@example.com`;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createUserMutation,
          variables: {
            createUserInput: {
              name: 'E2E Test User',
              email: randomEmail,
              password: 'password123',
              avatar: 'avatar.jpg',
            },
          },
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data.createUser).toHaveProperty('id');
          expect(res.body.data.createUser.email).toBe(randomEmail);
        });
    });

    it('should get all users', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: usersQuery,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data.users).toBeInstanceOf(Array);
        });
    });

    it('should fail to create user with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createUserMutation,
          variables: {
            createUserInput: {
              name: 'Duplicate User',
              email: 'test@example.com', // Existing email
              password: 'password123',
            },
          },
        })
        .expect(200)
        .then((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });
});
