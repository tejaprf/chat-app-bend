import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        require:true,
        enum:["Male","Female"]
    },
    // profilePic:{
    //     type:String,
    //     required:true
    // }
},{timestamps:true});

//creates collection named users as we gave User as name when modelling
const User=mongoose.model("User",userSchema);

export {User};