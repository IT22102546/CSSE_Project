import express from 'express'
import { updateItem,deleteItem,getItem } from '../controllers/admin.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router=express.Router();



//items
router.delete("/deleteitem/:id",deleteItem)
router.get('/getitem/:id', getItem);//for update fetch data
router.put("/updateitem",updateItem)






export default router