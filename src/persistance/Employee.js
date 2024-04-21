/* eslint-disable class-methods-use-this */
import db from './Database';
import Employee from '../models/Employee';
import {
  del, get, getAll, set,
} from './cache';

export default class EmployeeTable {
  async create(employee) {
    const query = `INSERT INTO employees (id, name, department, salary) VALUES ('${employee.id}', '${employee.name}', '${employee.department}', '${employee.salary}')`;
    const [result] = await db.query(query);
    await set(`EMPLOYEE:${employee.id}`, employee.getJson());
    return result;
  }

  async getEmployeeById(id) {
    const query = `SELECT * FROM employees WHERE id = '${id}'`;
    const cachedEmployee = await get(`EMPLOYEE:${id}`);
    if (cachedEmployee) {
      return new Employee(cachedEmployee);
    }
    const [[employee]] = await db.query(query);
    if (!employee) {
      return null;
    }
    await set(`EMPLOYEE:${id}`, employee);
    return new Employee(employee);
  }

  async getEmployees() {
    const query = 'SELECT * FROM employees';
    const cachedEmployees = await getAll('EMPLOYEE:*');
    if (cachedEmployees.length > 0) {
      return cachedEmployees.map((employee) => new Employee(employee));
    }
    const [employees] = await db.query(query);
    return employees
      .map((employee) => new Employee(employee));
  }

  async deleleEmployee(id) {
    const query = `DELETE FROM employees WHERE id = '${id}'`;
    const [result] = await db.query(query);
    await del(`EMPLOYEE:${id}`);
    if (result.affectedRows === 0) {
      throw new Error('Unable to delete the employee');
    }
    return result;
  }

  async updateEmployee(employee) {
    const query = `UPDATE employees SET name = '${employee.name}', department = '${employee.department}', salary = '${employee.salary}' WHERE id = '${employee.id}'`;
    const [result] = await db.query(query);
    await set(`EMPLOYEE:${employee.id}`, employee.getJson());
    if (result.changedRows === 0) {
      throw new Error('Unable to update the employee');
    }
    return result;
  }

  async getByDepartment(department) {
    const query = `SELECT * FROM employees WHERE department = '${department}'`;
    const [employees] = await db.query(query);
    return employees.map((employee) => new Employee(employee));
  }

  async sortBySalary(order) {
    let query = 'SELECT * FROM employees';
    if (order === 'asc') {
      query += ' ORDER BY salary ASC';
    } else if (order === 'desc') {
      query += ' ORDER BY salary DESC';
    }
    const [employees] = await db.query(query);
    return employees.map((employee) => new Employee(employee));
  }
}
