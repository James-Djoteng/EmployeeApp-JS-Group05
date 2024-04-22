import express from 'express';
import EmployeeController from '../controllers/EmployeeController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.get('/', authenticate, EmployeeController.getEmployees);
router.get('/:id', authenticate, EmployeeController.getEmployeeById);
router.post('/', authenticate, EmployeeController.createEmployee);
router.put('/:id', authenticate, EmployeeController.updateEmployee);
router.delete('/:id', authenticate, EmployeeController.deleteEmployee);
router.get('/:id/report', authenticate, EmployeeController.getReport);
router.post('/:id/report', authenticate, EmployeeController.createReport);

export default router;
