// routes/auth.js
import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { authenticate } from '../middlewares/auth.js'; // authenticate middleware'ini import edin
import { validateBody } from '../middlewares/validation.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/current', authenticate, authController.getCurrent); // Artık authenticate tanımlı olacak

export default router;