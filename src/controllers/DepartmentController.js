import Joi from 'joi';
import { departmentService } from '../services';

const createDepartmentSchema = Joi.object({
  name: Joi.string().min(1).max(50)
    .required(),
});

export default class DepartmentController {
  static async getDepartments(_req, res) {
    try {
      const departments = await departmentService.getAll();
      res.json(departments.map((dep) => dep.getJson()));
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getDepartmentById(req, res) {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Id parameter is required' });
      return;
    }
    const department = await departmentService.getById(id);
    if (!department) {
      res.status(404).json({ error: 'Department not found' });
    } else {
      res.json(department.getJson());
    }
  }

  static async createDepartment(req, res) {
    try {
      const newDepartmentData = req.body;
      const { error } = createDepartmentSchema.validate(newDepartmentData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const newDepartment = await departmentService.create(newDepartmentData);
      return res.status(201).json(newDepartment.getJson());
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
