import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function seedAdmin() {
  try {

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@gharsamma.com',
        role: 'ADMIN',
        isActive: true,
      },
    });

    if (existingAdmin) {
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@gharsamma.com',
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });


  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });

export default seedAdmin;

