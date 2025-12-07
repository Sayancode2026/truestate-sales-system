import express from 'express';
import { getSales, getFilterOptions, exportSalesCSV, getAllSales } from '../controllers/sales.controller.js';
import { validateRequest, salesQuerySchema } from '../middleware/validators.js';
import { apiLimiter, exportLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/all', getAllSales); 
router.get('/', apiLimiter, validateRequest(salesQuerySchema), getSales);
router.get('/filter-options', apiLimiter, getFilterOptions);
router.get('/export', exportLimiter, validateRequest(salesQuerySchema), exportSalesCSV);

export default router;
