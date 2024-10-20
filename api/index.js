import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import truckRoute from "./routes/truck.route.js";
import issueRoure from "./routes/issue.route.js"
import binRoute from "./routes/bin.route.js"

import assignRoute from "./routes/assignedRoute.route.js"

import stripe from "./routes/stripe.route.js";


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

app.use(cors(corsOptions));

app.use("/api/auth",authRoute);
app.use("/api/user",userRoute); 
app.use("/api/truck", truckRoute);
app.use("/api/issue", issueRoure);
app.use('/api/bin', binRoute);
app.use('/api/assign-route',assignRoute);
app.use("/api/stripe",stripe);


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    });
})

