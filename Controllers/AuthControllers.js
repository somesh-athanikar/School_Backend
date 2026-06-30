// // const { PrismaClient } = require('@prisma/client');
// const { PrismaClient } = require('../lib/prisma');
// const prisma = new PrismaClient();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { asyncHandler } = require('../Middlewares/errHandlarMiddleware');

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// // Seed admin on first run — call once
// const seedAdmin = async () => {
//   const exists = await prisma.user.findUnique({ where: { email: 'admin@school.com' } });
//   if (!exists) {
//     const hashed = await bcrypt.hash('admin123', 10);
//     await prisma.user.create({
//       data: { name: 'Admin', email: 'admin@school.com', password: hashed, role: 'ADMIN' },
//     });
//     console.log('Default admin created: admin@school.com / admin123');
//   }
// };
// seedAdmin();

// exports.login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ message: 'Email and password are required' });

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user || !(await bcrypt.compare(password, user.password)))
//     return res.status(401).json({ message: 'Invalid credentials' });

//   res.json({
//     token: generateToken(user.id),
//     user: { id: user.id, name: user.name, email: user.email, role: user.role },
//   });
// });

// exports.getMe = asyncHandler(async (req, res) => {
//   res.json(req.user);
// });


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma'); // Use the centralized instance
const { asyncHandler } = require('../Middlewares/errHandlarMiddleware');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Seed admin on first run — call once
const seedAdmin = async () => {
  const exists = await prisma.user.findUnique({ where: { email: 'admin@school.com' } });
  if (!exists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { name: 'Admin', email: 'admin@school.com', password: hashed, role: 'ADMIN' },
    });
    console.log('Default admin created: admin@school.com / admin123');
  }
};
seedAdmin();

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});