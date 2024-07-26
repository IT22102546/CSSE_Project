import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

const app = express();
app.use(cookieParser());
app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is Running on Port 3000");
});

const corsOptions = {
    origin: 'http://localhost:5173',
};


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    });
})

