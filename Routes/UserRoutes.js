const router = require('express').Router();
const userControllers = require('../Controllers/UserController');
const authMiddleware = require('../Middlewares/AuthMiddleware');

// Create a new user
router.post('/register', userControllers.createUser);

// Login a user
router.post('/login', userControllers.loginUser);

// Logout a user
router.post('/logout/:userId', userControllers.logoutUser);

// Update a user by id
router.put('/:userId', userControllers.updateUser);

// Delete a user by id
router.delete('/:userId', userControllers.deleteUser);

// Fetch all the users
router.get('/', userControllers.getAllUsers);

// Get user by id
router.get('/:userId', userControllers.getUserById);

// Get current user
router.get('/current/authenticated-user', authMiddleware, userControllers.getCurrentUser);

module.exports = router;