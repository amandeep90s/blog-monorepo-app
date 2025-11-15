import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Authentication (e2e)', () => {
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

  describe('/graphql - Authentication', () => {
    const signInMutation = `
      mutation SignIn($signInInput: SignInInput!) {
        signIn(signInInput: $signInInput) {
          id
          name
          email
          avatar
          accessToken
        }
      }
    `;

    it('should sign in with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signInMutation,
          variables: {
            signInInput: {
              email: 'test@example.com',
              password: 'password123',
            },
          },
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data.signIn).toHaveProperty('accessToken');
          expect(res.body.data.signIn.email).toBe('test@example.com');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signInMutation,
          variables: {
            signInInput: {
              email: 'test@example.com',
              password: 'wrongpassword',
            },
          },
        })
        .expect(200)
        .then((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with non-existent user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signInMutation,
          variables: {
            signInInput: {
              email: 'nonexistent@example.com',
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
