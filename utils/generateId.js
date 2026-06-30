const prisma = require('../lib/prisma');

const generateAdmissionNumber = async () => {
  const count = await prisma.student.count();
  const year = new Date().getFullYear();
  return `ADM${year}${String(count + 1).padStart(4, '0')}`;
};

const generateEmployeeId = async () => {
  const count = await prisma.teacher.count();
  return `EMP${String(count + 1).padStart(4, '0')}`;
};

module.exports = { generateAdmissionNumber, generateEmployeeId };