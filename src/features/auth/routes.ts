import { Router } from 'express';
import { changePassword } from './controllers/change-password.controller';

const router = Router();

router.post('/change-password', changePassword);

export default router; 