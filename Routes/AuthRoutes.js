const router = require('express').Router();
const { login, getMe } = require('../Controllers/AuthControllers');
const { protect } = require('../Middlewares/authMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;