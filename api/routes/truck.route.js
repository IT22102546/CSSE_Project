import express  from "express";
import { createTruck, deleteTruck, getAllTrucks, getTruck, updateTruck } from "../controllers/truck.controller.js";


const router = express.Router();

router.post('/add-truck', createTruck)
router.get('/get-all-trucks', getAllTrucks);
router.get('/get-a-truck/:id', getTruck);
router.put('/update-truck/:id',updateTruck);
router.delete('/delete-truck/:id',deleteTruck);

export default router;