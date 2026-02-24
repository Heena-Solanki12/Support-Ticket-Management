const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');

router.post('/', auth, role('MANAGER'), userController.createUser);

router.get('/', auth, role('MANAGER'), userController.getUsers);

module.exports = router;