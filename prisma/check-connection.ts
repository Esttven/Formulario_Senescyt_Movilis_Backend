import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
  console.log(JSON.stringify({ status: 'ok', database: 'postgresql' }));
}

main()
  .catch((error: unknown) => {
    console.error(JSON.stringify({ status: 'error', message: String(error) }));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
