import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Programs
  const meritProgram = await prisma.program.upsert({
    where: { code: 'MERIT' },
    update: {},
    create: {
      code: 'MERIT',
      name: 'Merit Scholarship',
      description: 'For top-performing students with GWA 1.75 or higher',
      isActive: true
    }
  });

  const needsBasedProgram = await prisma.program.upsert({
    where: { code: 'NEEDS_BASED' },
    update: {},
    create: {
      code: 'NEEDS_BASED',
      name: 'Needs-Based Grant',
      description: 'For students requiring financial support',
      isActive: true
    }
  });

  console.log('Programs created:', { meritProgram, needsBasedProgram });

  // Create Program Cycles
  const meritCycle = await prisma.programCycle.upsert({
    where: {
      programId_ayTerm: {
        programId: meritProgram.id,
        ayTerm: 'AY2025-2026 1st Sem'
      }
    },
    update: {},
    create: {
      programId: meritProgram.id,
      ayTerm: 'AY2025-2026 1st Sem',
      openAt: new Date('2025-11-01'),
      closeAt: new Date('2025-12-15'),
      maxSlots: 50,
      budgetCap: 250000
    }
  });

  const needsCycle = await prisma.programCycle.upsert({
    where: {
      programId_ayTerm: {
        programId: needsBasedProgram.id,
        ayTerm: 'AY2025-2026 1st Sem'
      }
    },
    update: {},
    create: {
      programId: needsBasedProgram.id,
      ayTerm: 'AY2025-2026 1st Sem',
      openAt: new Date('2025-11-01'),
      closeAt: new Date('2026-01-05'),
      maxSlots: 100,
      budgetCap: 300000
    }
  });

  console.log('Program cycles created:', { meritCycle, needsCycle });

  // Create Requirements for Merit Scholarship
  await prisma.requirement.createMany({
    data: [
      {
        programCycleId: meritCycle.id,
        code: 'COE',
        label: 'Certificate of Enrollment',
        description: 'Current certificate of enrollment for this semester',
        mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSizeMb: 5,
        mandatory: true,
        sortOrder: 1
      },
      {
        programCycleId: meritCycle.id,
        code: 'STUDENT_ID',
        label: 'Valid Student ID',
        description: 'Clear photo of your student ID',
        mimeTypes: ['image/jpeg', 'image/png'],
        maxSizeMb: 3,
        mandatory: true,
        sortOrder: 2
      },
      {
        programCycleId: meritCycle.id,
        code: 'GRADES',
        label: 'Transcript of Records / Grade Sheet',
        description: 'Most recent grades showing GWA',
        mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSizeMb: 5,
        mandatory: true,
        sortOrder: 3
      }
    ],
    skipDuplicates: true
  });

  // Create Requirements for Needs-Based Grant
  await prisma.requirement.createMany({
    data: [
      {
        programCycleId: needsCycle.id,
        code: 'INCOME_PROOF',
        label: 'Proof of Household Income',
        description: 'ITR, Certificate of Employment, or similar documents',
        mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSizeMb: 5,
        mandatory: true,
        sortOrder: 1
      },
      {
        programCycleId: needsCycle.id,
        code: 'BARANGAY_CLEARANCE',
        label: 'Barangay Clearance',
        description: 'Valid barangay clearance',
        mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSizeMb: 3,
        mandatory: true,
        sortOrder: 2
      },
      {
        programCycleId: needsCycle.id,
        code: 'STUDENT_ID',
        label: 'Valid Student ID',
        description: 'Clear photo of your student ID',
        mimeTypes: ['image/jpeg', 'image/png'],
        maxSizeMb: 3,
        mandatory: true,
        sortOrder: 3
      },
      {
        programCycleId: needsCycle.id,
        code: 'GRADES',
        label: 'Transcript of Records / Grade Sheet',
        description: 'Most recent grades showing GWA 2.25 or higher',
        mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSizeMb: 5,
        mandatory: true,
        sortOrder: 4
      }
    ],
    skipDuplicates: true
  });

  console.log('Requirements created');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
