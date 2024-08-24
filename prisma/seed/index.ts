import { seedUser } from "./user";
import { seedPost } from "./post";
import { db } from "~/server/db";
import { seedComment } from "./comment";

async function main() {
  await seedUser(db);
  await seedPost(db);
  await seedComment(db);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
