import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Posts (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Sign in to get auth token
    const signInMutation = `
      mutation SignIn($signInInput: SignInInput!) {
        signIn(signInInput: $signInInput) {
          accessToken
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: signInMutation,
        variables: {
          signInInput: {
            email: 'test@example.com',
            password: 'password123',
          },
        },
      });

    authToken = response.body.data.signIn.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/graphql - Posts', () => {
    const createPostMutation = `
      mutation CreatePost($createPostInput: CreatePostInput!) {
        createPost(createPostInput: $createPostInput) {
          id
          title
          slug
          content
          published
          author {
            id
            name
          }
        }
      }
    `;

    const postsQuery = `
      query Posts($skip: Float, $take: Float) {
        posts(skip: $skip, take: $take) {
          id
          title
          slug
          published
        }
      }
    `;

    const postBySlugQuery = `
      query GetPostBySlug($slug: String!) {
        getPostBySlug(slug: $slug) {
          id
          title
          slug
          content
          published
        }
      }
    `;

    it('should create a new post', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: createPostMutation,
          variables: {
            createPostInput: {
              title: 'E2E Test Post',
              slug: 'e2e-test-post',
              content: 'This is an e2e test post',
              thumbnail: 'thumbnail.jpg',
              published: true,
              authorId: 'test-author-id',
            },
          },
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data.createPost).toHaveProperty('id');
          expect(res.body.data.createPost.title).toBe('E2E Test Post');
          expect(res.body.data.createPost.slug).toBe('e2e-test-post');
        });
    });

    it('should get all posts', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: postsQuery,
          variables: {
            skip: 0,
            take: 10,
          },
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data.posts).toBeInstanceOf(Array);
        });
    });

    it('should get a post by slug', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: postBySlugQuery,
          variables: {
            slug: 'e2e-test-post',
          },
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data.getPostBySlug).toBeDefined();
          expect(res.body.data.getPostBySlug.slug).toBe('e2e-test-post');
        });
    });

    it('should fail to create a post with duplicate slug', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: createPostMutation,
          variables: {
            createPostInput: {
              title: 'Another Post',
              slug: 'e2e-test-post', // Duplicate slug
              content: 'Content',
              thumbnail: 'thumb.jpg',
              published: true,
              authorId: 'test-author-id',
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
