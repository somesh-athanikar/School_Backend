const prisma = require('../lib/prisma');
const { asyncHandler } = require('../Middlewares/errHandlarMiddleware');
const { generateEmployeeId } = require('../utils/generateId');

exports.getTeachers = asyncHandler(async (req, res) => {
  const teachers = await prisma.teacher.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(teachers);
});

exports.getTeacher = asyncHandler(async (req, res) => {
  const teacher = await prisma.teacher.findUnique({ where: { id: Number(req.params.id) } });
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
  res.json(teacher);
});

exports.createTeacher = asyncHandler(async (req, res) => {
  const { name, email, mobile, subject } = req.body;
  const employeeId = await generateEmployeeId();
  const teacher = await prisma.teacher.create({ data: { employeeId, name, email, mobile, subject } });
  res.status(201).json(teacher);
});

exports.updateTeacher = asyncHandler(async (req, res) => {
  const { name, email, mobile, subject } = req.body;
  const teacher = await prisma.teacher.update({
    where: { id: Number(req.params.id) },
    data: { name, email, mobile, subject },
  });
  res.json(teacher);
});

exports.deleteTeacher = asyncHandler(async (req, res) => {
  await prisma.teacher.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Teacher deleted successfully' });
});