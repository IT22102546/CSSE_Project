// routes/binRoutes.js
import express from 'express';
import { createOrUpdateBin, getAllBins, getAllBinss, resetBins, updateBinRequest } from '../controllers/bin.controller.js';

const router = express.Router();

// POST: Create or Update Bin
router.post('/createbin', createOrUpdateBin);
router.get('/get-all-bins',getAllBinss)
router.get('/getbins', getAllBins);
router.put('/bin/:id', updateBinRequest);
router.put('/resetBins/:id',resetBins)

export default router;