import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protectRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;        //taking the token
        if(!token)
        return res.status(401).json({error:"Unauthorized. No token found.."});

        const isDecoded=jwt.verify(token,process.env.JWT_SECRET_KEY);     //verifying the token
        
        if(!isDecoded){
            return res.status(401).json({error:"Unauthorized. Invalid token.."});
        }

        
        const user=await User.findById(isDecoded.userId);    //getting it from get and set cookie. This is the object id of user who signed in.
        req.user=user;                                       //sending the user data to the next function.
        next();                 //will run the next method which is specified when this protectedRoute is used.


    }catch(error){
        return res.status(500).json({error:"Internal server error"});
    } 
};

export default protectRoute;