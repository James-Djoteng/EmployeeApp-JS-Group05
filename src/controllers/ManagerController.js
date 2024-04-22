import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { managerService } from '../services';

const createManagerSchema = Joi.object({
  name: Joi.string().min(2).trim().required(),
  username: Joi.string().alphanum().min(3).required(),
  password: Joi.string().trim().min(5).max(30)
    .required(),
});

export default class ManagerController {
  static async create(req, res) {
    try {
      const { error } = createManagerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      const manager = await managerService.create(req.body);
      const token = jwt.sign({ id: manager.id }, process.env.SECRET);
      return res.status(201).json({
        manager: {
          name: manager.name,
          username: manager.username,
        },
        token,
      });
    } catch (error) {
      if (error.message === 'Username already exists') {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const manager = await managerService.login(username, password);
      const token = jwt.sign({ id: manager.id }, process.env.SECRET);
      return res.status(200).json({ token });
    } catch (error) {
      if (error.message === 'Invalid username or password') {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }
}
