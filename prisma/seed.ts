import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { Role } from "~/types/enum/Role";

const prisma = new PrismaClient();

const generatePassword = async (password: string) => await hash(password, 10);
async function main() {
  await prisma.user.upsert({
    where: { email: "admin@app.com" },
    update: {},
    create: {
      email: "admin@app.com",
      firstName: "Admin",
      lastName: "Admin",
      password: await generatePassword("admin"),
      roles: {
        connect: { id: Role.Admin },
      },
    },
  });
  await prisma.user.upsert({
    where: { email: "user@app.com" },
    update: {},
    create: {
      email: "user@app.com",
      firstName: "User",
      lastName: "User",
      password: await generatePassword("password"),
      roles: {
        connect: { id: Role.User },
      },
    },
  });
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
