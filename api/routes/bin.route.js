// routes/binRoutes.js
import express from 'express';
import { createOrUpdateBin, getAllBins } from '../controllers/bin.controller.js';

const router = express.Router();

// POST: Create or Update Bin
router.post('/createbin', createOrUpdateBin);
router.get('/get-all-bins',getAllBins)

export default router;
