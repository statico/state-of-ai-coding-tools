const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    const surveys = await prisma.survey.findMany();
    console.log('Connection successful! Found surveys:', surveys.length);
    console.log('Survey details:', surveys.map(s => ({ id: s.id, title: s.title, password: s.password })));
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();