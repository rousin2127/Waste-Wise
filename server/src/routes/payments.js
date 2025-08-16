import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { createPayment } from '../controllers/paymentController.js';

const router = Router();
router.post('/', auth, createPayment);
export default router;
