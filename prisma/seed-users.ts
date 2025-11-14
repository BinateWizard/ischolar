import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.resolve(__dirname, 'seed-users.json');
  if (!fs.existsSync(filePath)) {
    console.error('seed-users.json not found at', filePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const users: Array<{
    role: 'ADMIN' | 'STUDENT' | string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }> = JSON.parse(raw);

  console.log(`Seeding ${users.length} users from seed-users.json`);

  for (const u of users) {
    try {
      const hashed = await bcrypt.hash(u.password, 10);
      const userId = randomBytes(16).toString('hex');

      // Upsert profile by email
      const profile = await prisma.profile.upsert({
        where: { email: u.email },
        update: {
          firstName: u.firstName,
          lastName: u.lastName,
          password: hashed,
          role: u.role as any,
          verificationStatus: 'VERIFIED',
          emailVerified: new Date(),
          userId,
        },
        create: {
          userId,
          email: u.email,
          password: hashed,
          firstName: u.firstName,
          lastName: u.lastName,
          middleInitial: null,
          role: u.role as any,
          verificationStatus: 'VERIFIED',
          emailVerified: new Date(),
        }
      });

      console.log(`Upserted user ${u.email} (id=${profile.id})`);
    } catch (err) {
      console.error('Failed to upsert user', u.email, err);
    }
  }

  console.log('User seeding complete');
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
