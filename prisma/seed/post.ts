import { fakerFR as faker } from "@faker-js/faker";
import { type DbClient } from "~/server/db";

export const seedPost = async (prisma: DbClient) => {
  const now = new Date();

  const users = await prisma.user.findMany({
    take: 30,
  });

  const posts = [];

  const date = new Date();
  date.setDate(date.getDate() - 14);

  for (let i = 0; i < 90; i++) {
    const author = faker.helpers.arrayElement(users);
    posts.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs({ min: 1, max: 5 }),
      authorId: author.id,
      published: faker.datatype.boolean(),
      createdAt: faker.date.between({ from: date, to: now }),
    });
  }

  await prisma.post.createMany({ data: posts });
};
