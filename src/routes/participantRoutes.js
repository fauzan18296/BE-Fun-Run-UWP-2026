import express from 'express';
import { 
  getAllParticipants, 
  getParticipantById, 
  exportToExcel,
  getStatistics 
} from '../controllers/participantController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllParticipants);
router.get('/statistics', authenticateToken, getStatistics);
router.get('/export', authenticateToken, exportToExcel);
router.get('/:orderId', getParticipantById);

export default router;