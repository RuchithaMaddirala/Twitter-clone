import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup=async(req,res)=>{
    try {
        const {fullname, username,email, password} =req.body;
        const emailregex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailregex.test(email)){
            return res.status(400).json({error:"Invalid email format"});
        }

        const existingUser= await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error: "Username is already Taken"});
        }
        const existingEmail= await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error: "Email is already Taken"});
        }
        if(password.length <6){
            return res.status(400).json({error: "password must be atleast 6 characters long"});

        }

        //hash password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,

            });
        }else{
            res.status(400).json({error:"Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const login=async(req,res)=>{
    try {
        const {username, password} = req.body;
        const user= await User.findOne({username});
        const checkPassword = await bcrypt.compare(password, user?.password || "");
        if(!user || !checkPassword){
            return res.status(400).json({error: "Incorrect username or password"});
        }
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg,

            });
        
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}
export const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal server error"});
    }
};
export const getMe= async(req,res) =>{
    try {
        const user= await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}
