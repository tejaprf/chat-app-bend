import mongoose, { Mongoose, mongo } from "mongoose";
import { User } from "./user.model.js";

// type:mongoose.Schema.Types.ObjectId,
// ref:"User",
const friendsSchema=new mongoose.Schema({
    curUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Friend=mongoose.model("Friend",friendsSchema);

export {Friend};


//keeps track of friends list.