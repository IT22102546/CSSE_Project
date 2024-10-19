import express from 'express'
import { admin_signin, admin_signup,admin_details,store,allitems,itemCount } from '../controllers/Adminauth.controller.js';


const router=express.Router();

router.get("/admin_details",admin_details)
router.post("/admin_signup",admin_signup)//register
router.post("/admin_signin",admin_signin)//login

router.post("/store",store)
// router.get("/user/:id",getOrdersByCustomerId)//for data fetch user id
router.get("/users/items",allitems)
router.get("/itemCount",itemCount)
export default router