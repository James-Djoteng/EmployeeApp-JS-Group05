/* eslint-disable class-methods-use-this */
import db from './Database';
import {
  del, get, getAll, set,
} from './cache';
import Department from '../models/Department';

export default class DepartmentTable {
  async create(department) {
    const query = `INSERT INTO departments (id, name) VALUES ('${department.id}', '${department.name}')`;
    await db.query(query);
    await set(`DEPARTMENT:${department.id}`, department.getJson());
    return department;
  }

  async getDepartmentById(id) {
    const query = `SELECT * FROM departments WHERE id = '${id}'`;
    const cachedDepartment = await get(`DEPARTMENT:${id}`);
    if (cachedDepartment) {
      return new Department(cachedDepartment);
    }
    const [[department]] = await db.query(query);
    if (!department) {
      return null;
    }
    await set(`DEPARTMENT:${id}`, department);
    const dep = new Department(department);
    return dep;
  }

  async getDepartments() {
    const query = 'SELECT * FROM departments';
    const cachedDepartments = await getAll('DEPARTMENT:*');
    if (cachedDepartments.length > 0) {
      return cachedDepartments.map((department) => new Department(department));
    }
    const [departments] = await db.query(query);
    const allDepartments = departments.map((department) => new Department(department));
    await Promise.all(allDepartments.map(async (department) => {
      await set(`DEPARTMENT:${department.id}`, department.getJson());
    }));
    return allDepartments;
  }

  async deleleDepartment(id) {
    const query = `DELETE FROM departments WHERE id = '${id}'`;
    const [result] = await db.query(query);
    await del(`DEPARTMENT:${id}`);
    if (result.affectedRows === 0) {
      throw new Error('Unable to delete the department');
    }
    return result;
  }

  async updateDepartment(department) {
    const query = `UPDATE departments SET name = '${department.name}', members = '${department.members}' WHERE id = '${department.id}'`;
    const [result] = await db.query(query);
    await set(`DEPARTMENT:${department.id}`, department.getJson());
    if (result.changedRows === 0) {
      throw new Error('Unable to update the employee');
    }
    return result;
  }
}
