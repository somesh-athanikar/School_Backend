const router = require('express').Router();
const { getDashboard } = require('../Controllers/dashboardController');
const { protect, adminOnly } = require('../Middlewares/authMiddleware');

router.get('/', protect, adminOnly, getDashboard);

module.exports = router;