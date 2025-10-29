import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import 'dotenv/config';
import { PrismaClient } from 'generated/prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/ /g, '-') // replace spaces with hyphens
    .replace(/[^\w-]+/g, ''); // remove all non-word characters
}

async function main() {
  const defaultPassword = await hash('password123');

  // Create users and get their IDs
  const userData = Array.from({ length: 10 }).map(() => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
      password: defaultPassword,
    };
  });

  await prisma.user.createMany({
    data: userData,
  });

  // Fetch only user IDs from the created users
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const users: { id: string }[] = await prisma.user.findMany({
    select: { id: true },
  });

  console.log(`Created ${users.length} users`);

  // Get user IDs for random assignment
  const userIds: string[] = users.map((user) => user.id);

  // Create posts with random user assignment
  const posts = Array.from({ length: 30 }).map(() => {
    // Randomly select a user ID
    const randomUserIndex = Math.floor(Math.random() * userIds.length);
    const randomUserId = userIds[randomUserIndex];
    const fakerTitle = faker.lorem.sentence();

    return {
      title: fakerTitle,
      slug: generateSlug(fakerTitle),
      content: faker.lorem.paragraphs(3),
      thumbnail: faker.image.urlPicsumPhotos({ width: 240, height: 320 }),
      authorId: randomUserId,
      published: faker.datatype.boolean(),
    };
  });

  await Promise.all(
    posts.map(async (post) => {
      // Randomly select a user ID
      const randomUserIndex = Math.floor(Math.random() * userIds.length);
      const randomUserId = userIds[randomUserIndex];

      await prisma.post.create({
        data: {
          ...post,
          comments: {
            createMany: {
              data: Array.from({ length: 20 }).map(() => ({
                content: faker.lorem.sentence(),
                authorId: randomUserId,
              })),
            },
          },
        },
      });
    }),
  );

  console.log(`Created ${posts.length} posts`);
  console.log('Seeding completed.');
}

// Run the main function
main()
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
