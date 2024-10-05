import { fakerFR as faker } from "@faker-js/faker";
import { type DbClient } from "~/server/db";

export const seedComment = async (prisma: DbClient) => {
  const now = new Date();
  const users = await prisma.user.findMany({
    take: 20,
  });
  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 30,
  });

  const comments = [];
  for (let i = 0; i < 90; i++) {
    const post = faker.helpers.arrayElement(posts);
    const createdAt = faker.date.between({ from: post.createdAt, to: now });
    const updatedAt = faker.date.between({ from: createdAt, to: now });

    comments.push({
      postId: post.id,
      authorId: faker.helpers.arrayElement(users).id,
      content: faker.lorem.paragraphs({ min: 1, max: 5 }),
      createdAt,
      updatedAt,
    });
  }

  await prisma.comment.createMany({ data: comments });
};
