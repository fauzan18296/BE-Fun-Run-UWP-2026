import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';
import { validateLogin } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.get('/verify', authenticateToken, verifyToken);

export default router;