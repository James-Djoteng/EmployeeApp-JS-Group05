/* eslint-disable import/extensions */
import Joi from 'joi';
import express from 'express';
import multer from 'multer';
import path from 'path';
import EmployeeService from './src/services/Employee.js';
import db from './src/persistance/Database.js';
import { enqueueNotification } from './src/services/queue.js';

const app = express();
const port = 8080;

db.connect();

const employeeService = new EmployeeService();

app.use(express.json());

const createEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(50)
    .required(),
  department: Joi.string().min(2).max(50)
    .required(),
  salary: Joi.number().integer().min(0).required(),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  department: Joi.string().min(2).max(50),
  salary: Joi.number().integer().min(0),
});

app.get('/employees', async (req, res) => {
  try {
    const employees = await employeeService.getAll();
    res.json(employees.map((emp) => emp.getJson()));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Id parameter is required' });
    return;
  }
  const employee = await employeeService.getById(id);
  if (!employee) {
    res.status(404).json({ error: 'Employee not found' });
  } else {
    res.json(employee.getJson());
  }
});

app.post('/employees', async (req, res) => {
  try {
    const newEmployeeData = req.body;
    const { error } = createEmployeeSchema.validate(newEmployeeData);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      const newEmployee = await employeeService.create(newEmployeeData);
      res.status(201).json(newEmployee.getJson());
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployeeData = req.body;

    const { error } = updateEmployeeSchema.validate(updatedEmployeeData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updatedEmployee = await employeeService.update(updatedEmployeeData, id);
    // Enqueue a notification task upon successful employee update
    enqueueNotification({
      type: 'employee_update',
      employeeId: id,
    });
    return res.json(updatedEmployee.getJson());
  } catch (error) {
    if (error.message === 'Employee ID is required') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Id parameter is required' });
  }
  try {
    await employeeService.delete(id);
    return res.status(204).send();
  } catch (error) {
    if (error.message === 'Unable to delete the employee') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/employees/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const employeesInDepartment = await employeeService.getByDepartment(department);
    res.json(employeesInDepartment.map((emp) => emp.getJson()));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/employees/sort/:order', async (req, res) => {
  try {
    const { order } = req.params;
    const sortedEmployees = await employeeService.sortBySalary(order);
    res.json(sortedEmployees.map((emp) => emp.getJson()));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// Endpoint for uploading employee documents
// eslint-disable-next-line consistent-return
app.post('/employees/upload', upload.single('document'), (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Logic to save file details to the database or perform other operations
    res.status(201).json({ message: 'File uploaded successfully', filename: file.filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add endpoints for file downloads and management
// eslint-disable-next-line consistent-return
app.get('/employees/download/:filename', (req, res) => {
  const { filename } = req.params;
  if (!filename) {
    return res.status(400).json({ error: 'Filename parameter is required' });
  }
  const filePath = path.join(__dirname, 'uploads', filename);
  res.download(filePath);
});

const fs = require('fs');

// eslint-disable-next-line consistent-return
app.delete('/employees/delete/:filename', (req, res) => {
  const { filename } = req.params;
  if (!filename) {
    return res.status(400).json({ error: 'Filename parameter is required' });
  }
  const filePath = path.join(__dirname, 'uploads', filename);
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error('Error deleting file:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ message: 'File deleted successfully' });
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
