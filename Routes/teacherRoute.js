const router = require('express').Router();
const { getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher } = require('../Controllers/teacherController');
const { protect, adminOnly } = require('../Middlewares/authMiddleware');

router.use(protect, adminOnly);
router.get('/', getTeachers);
router.get('/:id', getTeacher);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;