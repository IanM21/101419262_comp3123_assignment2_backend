const express = require('express');
const { check } = require('express-validator');
const employeeController = require('../controllers/employeeController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', employeeController.getEmployees);

router.post('/', [
    check('first_name', 'First name is required').notEmpty().trim(),
    check('last_name', 'Last name is required').notEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('position', 'Position is required').notEmpty().trim(),
    check('salary', 'Salary must be a positive number').isFloat({ min: 0 }),
    check('department', 'Department is required').notEmpty().trim()
], employeeController.createEmployee);

router.get('/:id', employeeController.getEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
