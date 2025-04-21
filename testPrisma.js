import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function test() {
  const users = await prisma.user.findMany(); // Just an example
  console.log(users);
  await prisma.$disconnect();
}

test();
