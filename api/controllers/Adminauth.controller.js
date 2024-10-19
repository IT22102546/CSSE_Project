import Admin from "../models/admin.model.js";
import Item from "../models/item.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

//register
 
export const admin_details = async(req,res)=>{
    const data= await Admin.find({})
  
    res.json({success:true,data:data})
}


export const admin_signup=async(req,res)=>{
    const data=new Admin(req.body)
    await data.save()
    res.send({success:true,message:"data created successfuly"})
}


export const updateAdmin=async(req,res)=>{
    const {id,...rest}=req.body
    const data=await Admin.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
}




export const deleteAdmin =async(req,res)=>{
const id=req.params.id
const data=await Admin.deleteOne({_id:id})
res.send({success:true,message:"deleted successfully",data:data})
}




//update second
export const fetchupdateAdmin = async (req, res) => {
    const id = req.params.id;

    try {
        const discount = await Admin.findById(id);

        if (!discount) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        res.send({ success: true, message: "User fetched successfully", data: discount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};


////Login 
export const admin_signin=async (req, res) => {
    console.log('in-------------------------------');
    const { email, password } = req.body;
  
    try {
        console.log(email);  
      const user = await Admin.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
    
     // const isPasswordValid = await bcrypt.compare(password, user.password);
     const isPasswordValid1 = user.password===password;

      console.log('Input password:', password);
      console.log('Stored hashed password:', user.password);
      console.log('isPasswordValid:', isPasswordValid1);
      
      if (isPasswordValid1===false) { // Fixed condition
        console.log('Request body:', req.body);
        return res.status(401).json({ success: false, message: "Incorrect password" });
      

      }
  
      // If password is valid, send success message and user data
      res.status(200).json({ success: true, message: "Login successful", data: user });
    } catch (error) {
        console.log('Retrieved user:', user);

      console.error("Login error:", error);
      res.status(500).json({ success: false, message: error });
    }
};

//item register
export const store=async(req,res)=>{
    const data=new Item(req.body)
    await data.save()
    res.send({success:true,message:"data created successfuly"})
}



//get items by userid



//all items


export const allitems = async (req, res, next) => {
    try{
    
        const orders=await Item.find({})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


export const itemCount =async(req,res)=>{
    try{
        const users=await Item.find({});

        return res.status(200).json({
            count:users.length,
            data:users
        })

    }catch(err){
            console.log(err.message);
            res.json({success:true,message:"Order count successfully",data:data})
    }

}


// export const google=async(req,res,next)=>{
//     try{
//         const user=await User.findOne({email:req.body.email})

//         if(user){
//             const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
//             const {password:hashedPassword, ...rest}=user._doc;
//             const expiryDate=new Date(Date.now() + 24 * 60 * 60 * 1000);
//             res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
//             .status(200)
//             .json(rest);
       
//         }else{
//             const generatedPassword=
//             Math.random().toString(36).slice(-8)+
//             Math.random().toString(36).slice(-8)

//             const hashedPassword=bcryptjs.hashSync
//             (generatedPassword,10);

//             const newUser=new User({username:req.body.name.split(' ').join('').toLowerCase()+
//                 Math.random().toString(36).slice(-8),
//                 email:req.body.email,password:hashedPassword,profilePicture:req.body.photo,
//             });
//             await newUser.save();
//             const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
//             const {password:hashedPassword2, ...rest}=newUser._doc;
//             const expiryDate=new Date(Date.now() + 24 * 60 * 60 * 1000);
//             res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
//             .status(200)
//             .json(rest);


//         }
//     }catch(error){
//         next(error)
//     }
// }


//  // Adjust the path as needed
// //images
// export const google1 = async (req, res, next) => {
//     try {
//         const user = await Item.findOne({ email: req.body.itemId });

//         if (user) {
//             const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//             const { password, ...rest } = user._doc;
//             const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
//             res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
//                 .status(200)
//                 .json(rest);
//         } else {
//             const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
//             const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

//             const newUser = new Item({
//                 username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
//                 email: req.body.itemId,
//                 password: hashedPassword,
//                 profilePicture: req.body.photo
//             });
            
//             await newUser.save();

//             const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//             const { password, ...rest } = newUser._doc;
//             const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
//             res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
//                 .status(200)
//                 .json(rest);
//         }
//     } catch (error) {
//         next(error);
//     }
// };






// export const signout=(req,res)=>{
//     res.clearCookie('access_token').status(200).json('Signout Success')
// }