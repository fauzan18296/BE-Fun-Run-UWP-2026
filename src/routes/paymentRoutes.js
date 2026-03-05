import express from 'express';
import { createPayment, handleWebhook, checkPaymentStatus } from '../controllers/paymentController.js';
import { validateRegistration } from '../middleware/validate.js';

const router = express.Router();

router.post('/create', validateRegistration, createPayment);
router.post('/webhook', handleWebhook);
router.get('/status/:orderId', checkPaymentStatus);

export default router;