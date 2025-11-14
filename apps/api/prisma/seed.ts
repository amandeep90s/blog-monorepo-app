import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import 'dotenv/config';

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
      email: faker.internet.email().toLowerCase(),
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
      password: defaultPassword,
    };
  });

  await prisma.user.createMany({
    data: userData,
  });

  // Fetch only user IDs from the created users

  const users: { id: string }[] = await prisma.user.findMany({
    select: { id: true },
  });

  console.log(`Created ${users.length} users`);

  // Get user IDs for random assignment
  const userIds: string[] = users.map((user) => user.id);

  // Helper function to get random user ID
  const getRandomUserId = () =>
    userIds[Math.floor(Math.random() * userIds.length)];

  // Create posts in batch for better performance
  const postsData = Array.from({ length: 50 }).map(() => {
    const fakerTitle = faker.lorem.sentence();

    return {
      title: fakerTitle,
      slug: generateSlug(fakerTitle),
      content: faker.lorem.paragraphs(3),
      thumbnail: faker.image.urlPicsumPhotos({ width: 240, height: 320 }),
      authorId: getRandomUserId(),
      published: true,
    };
  });

  // Create posts using createMany for better performance
  await prisma.post.createMany({
    data: postsData,
  });

  console.log(`Created ${postsData.length} posts`);

  // Fetch created posts to add comments
  const createdPosts = await prisma.post.findMany({
    select: { id: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Create comments in batch
  const commentsData = createdPosts.flatMap((post) =>
    Array.from({ length: 15 }).map(() => ({
      content: faker.lorem.sentence(),
      postId: post.id,
      authorId: getRandomUserId(),
    })),
  );

  // Batch insert all comments at once
  await prisma.comment.createMany({
    data: commentsData,
  });

  console.log(`Created ${commentsData.length} comments`);
  console.log('Seeding completed successfully!');
}

// Run the main function
main()
  .then(() => {
    void prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
