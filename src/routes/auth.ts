import { Router } from 'express';
import { register } from '../controllers/authController';
import { login } from '../controllers/authController';
import { logout } from '../controllers/authController';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
export default router;
