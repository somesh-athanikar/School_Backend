const prisma = require('../lib/prisma');
const { asyncHandler } = require('../Middlewares/errHandlarMiddleware');

exports.getDashboard = asyncHandler(async (req, res) => {
  const [totalStudents, totalTeachers, totalHomework] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.homework.count(),
  ]);
  res.json({ totalStudents, totalTeachers, totalHomework });
});