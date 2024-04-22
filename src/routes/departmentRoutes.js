import express from 'express';
import DepartmentController from '../controllers/DepartmentController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.get('/', authenticate, DepartmentController.getDepartments);
router.get('/:id', authenticate, DepartmentController.getDepartmentById);
router.post('/', authenticate, DepartmentController.createDepartment);

export default router;
