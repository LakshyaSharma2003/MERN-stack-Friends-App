const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT secret key
const JWT_SECRET = 'secret';

// Signup
exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.create({ username, password });
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ token });
};

// Get all users (for search)
exports.getUsers = async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user.userId } }); // Exclude current user
    res.status(200).json(users);
};

// Add friend
exports.addFriend = async (req, res) => {
    const user = await User.findById(req.user.userId);
    const friend = await User.findById(req.params.id);

    if (!user || !friend) return res.status(404).json({ error: 'User not found' });

    user.friends.push(friend);
    await user.save();

    res.status(200).json({ message: 'Friend added' });
};
