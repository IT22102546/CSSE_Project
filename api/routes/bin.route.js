// routes/binRoutes.js
import express from 'express';
import { createOrUpdateBin } from '../controllers/bin.controller.js';

const router = express.Router();

// POST: Create or Update Bin
router.post('/createbin', createOrUpdateBin);

export default router;
