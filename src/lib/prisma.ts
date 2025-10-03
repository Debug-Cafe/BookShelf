import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany();
  console.log(users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
