import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'aezravito12@gmail.com';
  
  console.log(`Setting ${email} as ADMIN with VERIFIED status...`);
  
  const profile = await prisma.profile.update({
    where: { email },
    data: {
      role: 'ADMIN',
      verificationStatus: 'VERIFIED'
    }
  });

  console.log('✅ Success!');
  console.log('Profile:', {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    verificationStatus: profile.verificationStatus
  });
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
