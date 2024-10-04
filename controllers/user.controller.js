import mongoose from "mongoose";
import { Friend } from "../models/user.friends.js";

export const getFriends=async (req,res)=>{
    try{
        const friends=await Friend.findOne({curUser:req.user._id}).populate({
            path:"friends",
            select:"_id userName",
        });
        // const friends=await Friend.findOne({curUser:req.user._id});
        
        console.log(friends["friends"]);
    
        return res.status(200).json(friends["friends"]);
        
    }catch(err){
        return res.status(500).json({error:"Internal server error."})
    }
};

