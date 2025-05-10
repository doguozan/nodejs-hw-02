import express from 'express';
import * as usersController from '../controllers/users.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Tüm rotaları authenticate middleware ile koru
router.use(authenticate);

// Kullanıcı profilini getir
router.get('/current', usersController.getCurrentUser);

export default router;