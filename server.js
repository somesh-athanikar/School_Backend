const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./Routes/AuthRoutes');
const dashboardRoutes = require('./Routes/dashboardRoute');
const studentRoutes = require('./Routes/studentRoute');
const teacherRoutes = require('./Routes/teacherRoute');
const homeworkRoutes = require('./Routes/homeworkRoute');
const { errorHandler } = require('./Middlewares/errHandlarMiddleware');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (no download header = inline preview only)
app.use('/uploads', (req, res, next) => {
  res.setHeader('Content-Disposition', 'inline');
  next();
}, express.static(path.join(__dirname, 'src/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/homework', homeworkRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));