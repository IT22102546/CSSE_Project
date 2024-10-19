
import Item from "../models/item.model.js"
import { errorHandler } from "../utils/error.js"
import Admin from "../models/admin.model.js"
import bcryptjs from 'bcryptjs';





export const test1 = (req, res) => {
    res.json({
        message: 'API is working'
    });
}


export const updateItem =async(req,res)=>{
    const {id,...rest}=req.body
    const data=await Item.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
}

export const deleteItem = async (req, res, next) => {
    let petId=req.params.id;
    console.log(petId)
    try {
        await Item.findByIdAndDelete(petId);
        res.status(200).json('The Order has been deleted');
    } catch (error) {
        next(error);
    }
}




export const getItem= async (req, res) => {
    const id = req.params.id;

    try {
        const discount = await Item.findById(id);

        if (!discount) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        res.send({ success: true, message: "User fetched successfully", data: discount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};




     

