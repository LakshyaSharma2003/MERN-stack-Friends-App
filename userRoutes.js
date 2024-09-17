const express = require('express');
const { signup, login, getUsers, addFriend } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', authMiddleware, getUsers);
router.post('/add-friend/:id', authMiddleware, addFriend);

module.exports = router;
