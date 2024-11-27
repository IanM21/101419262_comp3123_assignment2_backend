const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

exports.createEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { first_name, last_name, email, position, salary, department } = req.body;

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        if (isNaN(salary) || salary < 0) {
            return res.status(400).json({ message: 'Invalid salary amount' });
        }

        const employee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            department,
            created_by: req.user.id
        });

        await employee.save();

        res.status(201).json({
            message: 'Employee created successfully',
            employee_id: employee.id
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || '-created_at';
        const search = req.query.search || '';

        const query = search ? {
            $or: [
                { first_name: { $regex: search, $options: 'i' } },
                { last_name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const employees = await Employee.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('created_by', 'username');

        const total = await Employee.countDocuments(query);

        res.status(200).json({
            employees,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalEmployees: total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('created_by', 'username');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['first_name', 'last_name', 'email', 'position', 'salary', 'department'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates!' });
        }

        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Only admins can update any employee, regular users can only update employees they created
        if (req.user.role !== 'admin' && employee.created_by.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this employee' });
        }

        updates.forEach(update => employee[update] = req.body[update]);
        await employee.save();

        res.status(200).json({
            message: 'Employee updated successfully',
            employee
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Only admins can delete any employee, regular users can only delete employees they created
        if (req.user.role !== 'admin' && employee.created_by.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this employee' });
        }

        await employee.deleteOne();
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
