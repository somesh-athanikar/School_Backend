const prisma = require('../lib/prisma');
const { asyncHandler } = require('../Middlewares/errHandlarMiddleware');
const { generateAdmissionNumber } = require('../utils/generateId');

exports.getStudents = asyncHandler(async (req, res) => {
  const { search, class: cls, section } = req.query;
  const where = {
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { admissionNumber: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(cls && { class: cls }),
    ...(section && { section }),
  };
  const students = await prisma.student.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(students);
});

exports.getStudent = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: Number(req.params.id) } });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

exports.createStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, class: cls, section, parentName, parentMobile, address } = req.body;
  const admissionNumber = await generateAdmissionNumber();
  const student = await prisma.student.create({
    data: { admissionNumber, firstName, lastName, class: cls, section, parentName, parentMobile, address },
  });
  res.status(201).json(student);
});

exports.updateStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, class: cls, section, parentName, parentMobile, address } = req.body;
  const student = await prisma.student.update({
    where: { id: Number(req.params.id) },
    data: { firstName, lastName, class: cls, section, parentName, parentMobile, address },
  });
  res.json(student);
});

exports.deleteStudent = asyncHandler(async (req, res) => {
  await prisma.student.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Student deleted successfully' });
});