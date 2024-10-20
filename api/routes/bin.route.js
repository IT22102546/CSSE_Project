// routes/binRoutes.js
import express from 'express';
<<<<<<< HEAD
import { createOrUpdateBin, getAllBins, getAllBinss, resetBins, updateBinRequest,getABin } from '../controllers/bin.controller.js';
=======

import { createOrUpdateBin, getAllBins, getAllBinss, resetBins, updateBinRequest,getABin } from '../controllers/bin.controller.js';

>>>>>>> b795b52fb96ddb414979279935ba63153bf7b1ed

const router = express.Router();

// POST: Create or Update Bin
router.post('/createbin', createOrUpdateBin);
router.get('/get-all-bins',getAllBinss)
router.get('/getbins', getAllBins);
router.get('/get-bin/:id',getABin);
router.put('/bin/:id', updateBinRequest);
router.put('/resetBins/:id',resetBins)
router.get('/requests/:userId', getUserRequests);


export default router;