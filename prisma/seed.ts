import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { Role } from "~/types/enum/Role";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const generatePassword = async (password: string) => await hash(password, 10);
async function main() {
  const users = [];
  for (let i = 0; i < 50; i++) {
    users.push({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: await generatePassword("password"),
      roles: faker.helpers.arrayElements([Role.Admin, Role.User]),
      active: faker.datatype.boolean(),
    });

    await prisma.$transaction([
      prisma.user.upsert({
        where: { email: "admin@app.com" },
        update: {},
        create: {
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
      prisma.user.upsert({
        where: { email: "user@app.com" },
        update: {},
        create: {
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
        prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            active: user.active,
            roles: {
              connect: user.roles.map((role) => ({ id: role })),
            },
          },
        }),
      ),
    ]);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
