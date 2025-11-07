const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@quiz.com' },
    update: {},
    create: {
      email: 'admin@quiz.com',
      password: adminPassword,
      name: 'Quiz Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  });

  // Create sample student user
  const studentPassword = await bcrypt.hash('student123', 10);
  
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@quiz.com' },
    update: {},
    create: {
      email: 'student@quiz.com',
      password: studentPassword,
      name: 'Quiz Student',
      role: 'STUDENT',
    },
  });

  console.log('✅ Student user created:', {
    id: studentUser.id,
    email: studentUser.email,
    name: studentUser.name,
    role: studentUser.role,
  });

  // Create sample quiz
  const sampleQuiz = await prisma.quiz.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Math Basics Quiz',
      description: 'Test your basic math skills with this fun quiz!',
      isActive: true,
      createdById: adminUser.id,
    },
  });

  console.log('✅ Sample quiz created:', {
    id: sampleQuiz.id,
    title: sampleQuiz.title,
    description: sampleQuiz.description,
  });

  // Create sample questions
  const questions = [
    {
      question: 'What is 2 + 2?',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      order: 1,
    },
    {
      question: 'What is 5 × 3?',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      order: 2,
    },
    {
      question: 'Is 10 greater than 5?',
      type: 'TRUE_FALSE',
      points: 1,
      order: 3,
    },
  ];

  for (const questionData of questions) {
    const question = await prisma.question.create({
      data: {
        ...questionData,
        quizId: sampleQuiz.id,
      },
    });

    // Create options for multiple choice and true/false questions
    if (questionData.type === 'MULTIPLE_CHOICE') {
      const options = questionData.question === 'What is 2 + 2?' 
        ? [
            { text: '3', isCorrect: false, order: 1 },
            { text: '4', isCorrect: true, order: 2 },
            { text: '5', isCorrect: false, order: 3 },
            { text: '6', isCorrect: false, order: 4 },
          ]
        : [
            { text: '12', isCorrect: false, order: 1 },
            { text: '15', isCorrect: true, order: 2 },
            { text: '18', isCorrect: false, order: 3 },
            { text: '20', isCorrect: false, order: 4 },
          ];

      for (const optionData of options) {
        await prisma.option.create({
          data: {
            ...optionData,
            questionId: question.id,
          },
        });
      }
    } else if (questionData.type === 'TRUE_FALSE') {
      // Create True/False options
      const options = [
        { text: 'True', isCorrect: true, order: 1 },
        { text: 'False', isCorrect: false, order: 2 },
      ];

      for (const optionData of options) {
        await prisma.option.create({
          data: {
            ...optionData,
            questionId: question.id,
          },
        });
      }
    }

    console.log('✅ Question created:', question.question);
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin: admin@quiz.com / admin123');
  console.log('Student: student@quiz.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
