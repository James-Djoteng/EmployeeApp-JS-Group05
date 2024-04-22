import express from 'express';
import ManagerController from '../controllers/ManagerController';

const router = express.Router();

router.post('/signup', ManagerController.create);
router.post('/login', ManagerController.login);

export default router;
