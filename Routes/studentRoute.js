const router = require('express').Router();
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('../Controllers/studentController');
const { protect, adminOnly } = require('../Middlewares/authMiddleware');

router.use(protect, adminOnly);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;