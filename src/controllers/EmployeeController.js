import Joi from 'joi';
import fs from 'fs';
import { employeeService, departmentService } from '../services';

const asyncFs = fs.promises;

const createEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(50)
    .required(),
  departmentId: Joi.string().min(2).max(50)
    .required(),
  salary: Joi.number().integer().min(0).required(),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  departmentId: Joi.string().min(2).max(50),
  salary: Joi.number().integer().min(0),
});

export default class EmployeeController {
  static async getEmployees(req, res) {
    try {
      const { department, minSalary, maxSalary } = req.query;

      const criteria = {};
      if (department) {
        criteria.department = department;
      }
      if (minSalary) {
        criteria.minSalary = parseInt(minSalary, 10);
      }
      if (maxSalary) {
        criteria.maxSalary = parseInt(maxSalary, 10);
      }
      const employees = await employeeService.getAll(criteria);

      return res.json(employees.map((emp) => emp.getJson()));
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEmployeeById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Id parameter is required' });
    }
    const employee = await employeeService.getById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.json(employee.getJson());
  }

  static async createEmployee(req, res) {
    try {
      const newEmployeeData = req.body;
      const { error } = createEmployeeSchema.validate(newEmployeeData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const department = await departmentService.getById(newEmployeeData.departmentId);
      if (!department) {
        return res.status(400).json({ error: 'Department not found' });
      }
      newEmployeeData.departmentName = department.name;
      const newEmployee = await employeeService.create(newEmployeeData);
      return res.status(201).json(newEmployee.getJson());
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const updatedEmployeeData = req.body;

      const { error } = updateEmployeeSchema.validate(updatedEmployeeData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const updatedEmployee = await employeeService.update(updatedEmployeeData, id);
      return res.json(updatedEmployee.getJson());
    } catch (error) {
      if (error.message === 'Employee ID is required') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteEmployee(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Id parameter is required' });
    }
    try {
      await employeeService.delete(id);
      return res.status(204).send();
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unable to delete the employee') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createReport(req, res) {
    const { id } = req.params;
    const { report } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Id parameter is required' });
    }
    try {
      const employee = await employeeService.getById(id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      const parent = '/tmp/reports';
      await asyncFs.mkdir(parent, { recursive: true });
      const path = `/tmp/reports/${id}.md`;
      await asyncFs.writeFile(path, report, 'utf-8');
      return res.status(201).json({ report });
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getReport(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Id parameter is required' });
    }
    try {
      const employee = await employeeService.getById(id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      const path = `/tmp/reports/${id}.md`;
      const report = await asyncFs.readFile(path, 'utf-8');
      return res.status(200).json({ report });
    } catch (error) {
      if (error.message === 'Employee not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.code === 'ENOENT') {
        return res.status(200).json({ report: '' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
