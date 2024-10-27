import { hash } from "bcrypt";
import { fakerFR as faker } from "@faker-js/faker";
import { Role } from "~/types/enum/Role";
import { type DbClient } from "~/server/db";

const generatePassword = async (password: string) => await hash(password, 10);

export const seedUser = async (prisma: DbClient) => {
  const users = [];
  for (let i = 0; i < 50; i++) {
    const createdAt = faker.date.between({
      from: new Date(2020, 0, 1),
      to: new Date(),
    });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
    users.push({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await generatePassword("password"),
      roles: faker.helpers.arrayElements([Role.Admin, Role.User]),
      active: faker.datatype.boolean(),
      createdAt,
      updatedAt,
    });
  }

  await prisma.$transaction([
    prisma.user.create({
      data: {
        email: "admin@app.com",
        firstName: "Admin",
        lastName: "Admin",
        password: await generatePassword("admin"),
        active: true,
        roles: {
          connect: [{ id: Role.Admin }],
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "user@app.com",
        firstName: "User",
        lastName: "User",
        password: await generatePassword("password"),
        active: true,
        roles: {
          connect: { id: Role.User },
        },
      },
    }),
    ...users.map((user) =>
      prisma.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          active: user.active,
          roles: {
            connect: user.roles.map((role) => ({ id: role })),
          },
          createdAt: user.createdAt,
        },
      }),
    ),
  ]);
};
