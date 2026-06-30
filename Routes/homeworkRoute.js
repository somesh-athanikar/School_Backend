const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../Middlewares/authMiddleware');
const {
  getHomework, getAllHomework, getHomeworkById,
  createHomework, updateHomework, publishHomework, deleteHomework,
} = require('../Controllers/homeworkController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpeg|jpg|png|gif|mp4|webm|mov/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only PDF, Image, and Video files are allowed'));
  },
});

// Public - parents can view
router.get('/public', getHomework);
router.get('/public/:id', getHomeworkById);

// Protected - admin/teacher
router.use(protect);
router.get('/', getAllHomework);
router.get('/:id', getHomeworkById);
router.post('/', upload.array('attachments', 5), createHomework);
router.put('/:id', updateHomework);
router.patch('/:id/publish', publishHomework);
router.delete('/:id', deleteHomework);

module.exports = router;