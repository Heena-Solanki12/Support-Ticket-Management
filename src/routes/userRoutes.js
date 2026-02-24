const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createUser, getUSers } = require('../controllers/userController');

router.post('/', auth, role('MANAGER'), createUser);

router.get('/', auth, role('MANAGER'), getUSers);

module.exports = router;