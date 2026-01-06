import express  from "express";
import { createCollectionReport, getAllCollectionReports } from "../controllers/recordcollection.controller.js";


const router = express.Router();

router.post('/create-record', createCollectionReport)
router.get('/get-all-records', getAllCollectionReports);

export default router;