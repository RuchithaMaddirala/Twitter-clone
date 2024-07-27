import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js";
import { connect } from "mongoose";
import connectmongodb from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
const app=express()
    
    dotenv.config()
    const PORT= process.env.PORT || 5000
    console.log(process.env.MONGO_URI);

    app.use(express.json()); //to parse req.body
    app.use(express.urlencoded({extended:true}));
    app.use(cookieParser());

    app.use("/api/auth",authRoutes);
    app.use("/api/users",userRoutes);
    app.listen(PORT,()=>{
        console.log(`server is  running at ${PORT}`);
        connectmongodb();
    });