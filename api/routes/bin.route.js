// routes/binRoutes.js
import express from 'express';
import { createOrUpdateBin, getAllBins, getUserRequests, resetBins, updateBinRequest } from '../controllers/bin.controller.js';

const router = express.Router();

// POST: Create or Update Bin
router.post('/createbin', createOrUpdateBin);
router.get('/getbins', getAllBins);
router.put('/bin/:id', updateBinRequest);
router.put('/resetBins/:id',resetBins);
router.get('/requests/:userId', getUserRequests);


export default router;