
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genAndSetCookie from "../utils/genAndSetCookie.js";
import { Friend } from "../models/user.friends.js";

export const signup=async (req,res)=>{
    try{
        console.log(req.body);
        const {fullName,userName,password,confirmPassword,gender}=req.body; //If variable name and keyname is same i.e fullName as key and in req.body adn fullName as variable defined here, then its value will be automatically assigned to this variable.

        if(password!==confirmPassword)
        return res.status(400).json({error:"Passwords don't match"});

        const user=await User.findOne({userName});  //find one returns null if no user. But if you use find then it will return emtpy array then it will be accepte in below if condition and doesn't create user.
        if(user){
            return res.status(400).json({error:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            fullName,userName,password:hashPassword,gender
        })
        await newUser.save();

        const friend=new Friend({
            curUser: newUser._id,
            friends:[]
        })
        await friend.save();
        genAndSetCookie(newUser._id,res);
        return res.status(201).json({id:newUser._id,fullName:newUser.fullName,userName:newUser.userName,message:"User created successfully."})

    }catch(err){
        console.log("Error in the signup controller",err.message);
        res.status(500).json({error:"Internal server error."});
    }
    console.log('signup');
    res.send('signup');
}

export const login=async (req,res)=>{
    try{
        const {userName,password}=req.body;
        const user=await User.findOne({userName});
        if(user){
            const ispasswordMatch=await bcrypt.compare(password,user.password);
            if(ispasswordMatch){
                console.log("Login user Id ",user._id);
                genAndSetCookie(user._id,res);
                return res.status(200).json({message:"Successfully logged in.",id:user._id,fullName:user.fullName,userName:user.userName});
            }
            return res.status(400).json({message:"Incorrect username or password"});
        }

        return res.status(400).json({error:"User doesn't exists."});

    }catch(err){
        console.log("Error in login controller.",err.message);
        return res.status(500).json({error:"Internal server error."});
    }
}

export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        console.log("User logged out");
        return res.status(200).json({message:"User logged out successfully"});
    }catch(err){
        console.log("Error in the logout controller",err.message);
        return res.status(500).json({error:"Internal server error."})
    }
}

export const checkUser=async (req,res)=>{
    const {userName}=req.params;
    try{
        const isExists=await User.findOne({userName});
        if(isExists)
            return res.status(200).json({error:"Username already exists"});
        else
            return res.status(200).json({message:"Username doesn't exists"});
    }catch(err){
        console.log("Error in checkUser controller");
        return res.status(500).json({error:"Internal server error."});
    }
}