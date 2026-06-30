const prisma = require('../lib/prisma');
const { asyncHandler } = require('../Middlewares/errHandlarMiddleware');
const fs = require('fs');
const path = require('path');

exports.getHomework = asyncHandler(async (req, res) => {
  const { search, class: cls, subject } = req.query;
  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(cls && { class: cls }),
    ...(subject && { subject }),
  };
  const homework = await prisma.homework.findMany({
    where,
    include: { attachments: true, teacher: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(homework);
});

exports.getAllHomework = asyncHandler(async (req, res) => {
  const homework = await prisma.homework.findMany({
    include: { attachments: true, teacher: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(homework);
});

exports.getHomeworkById = asyncHandler(async (req, res) => {
  const hw = await prisma.homework.findUnique({
    where: { id: Number(req.params.id) },
    include: { attachments: true, teacher: { select: { name: true } } },
  });
  if (!hw) return res.status(404).json({ message: 'Homework not found' });
  res.json(hw);
});

exports.createHomework = asyncHandler(async (req, res) => {
  const { title, description, subject, class: cls, dueDate, teacherId } = req.body;
  const files = req.files || [];

  const hw = await prisma.homework.create({
    data: {
      title, description, subject,
      class: cls,
      dueDate: new Date(dueDate),
      teacherId: Number(teacherId),
      attachments: {
        create: files.map(f => ({
          filename: f.filename,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
        })),
      },
    },
    include: { attachments: true },
  });
  res.status(201).json(hw);
});

exports.updateHomework = asyncHandler(async (req, res) => {
  const { title, description, subject, class: cls, dueDate } = req.body;
  const hw = await prisma.homework.update({
    where: { id: Number(req.params.id) },
    data: { title, description, subject, class: cls, dueDate: new Date(dueDate) },
    include: { attachments: true },
  });
  res.json(hw);
});

exports.publishHomework = asyncHandler(async (req, res) => {
  const hw = await prisma.homework.update({
    where: { id: Number(req.params.id) },
    data: { published: true },
  });
  res.json(hw);
});

exports.deleteHomework = asyncHandler(async (req, res) => {
  const hw = await prisma.homework.findUnique({
    where: { id: Number(req.params.id) },
    include: { attachments: true },
  });
  // Delete physical files
  hw.attachments.forEach(a => {
    const filePath = path.join(__dirname, '../../src/uploads', a.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });
  await prisma.homework.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Homework deleted' });
});