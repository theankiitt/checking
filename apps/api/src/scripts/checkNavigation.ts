
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const config = await prisma.systemConfig.findUnique({
        where: { key: 'navigation_menu' }
    });
}

main()
    .finally(() => prisma.$disconnect());
