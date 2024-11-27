const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.post('/signup', [
    check('username', 'Username is required').notEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role').optional().isIn(['admin', 'user'])
], userController.signup);

router.post('/login', [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
], userController.login);

module.exports = router;
