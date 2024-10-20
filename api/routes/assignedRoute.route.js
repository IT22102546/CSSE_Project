import express  from "express";
import { createAssignedRoute,deleteAssignedRoute,updateAssignedRoute,getAssignedRoute,getAllAssignedRoutes } from "../controllers/assignedRoute.controller.js";


const router = express.Router();

router.post('/create-assign-route', createAssignedRoute )
router.get('/get-all-assigned-routes', getAllAssignedRoutes);
router.get('/get-a-assigned-route/:id', getAssignedRoute);
// router.get('/get-a-assigned-route-truckid/:id', );
// router.get('/finished-assigned-route-collector/:id', );
router.put('/update-assigned-route/:id', updateAssignedRoute);
router.delete('/delete-assigned-route/:id', deleteAssignedRoute);

export default router;