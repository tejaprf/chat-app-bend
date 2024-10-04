import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protectRouteClient=async (req,res)=>{
    try{
        // console.log(req.cookies)
        const token=req.cookies.jwt;        //taking the token
        if(!token)
        return res.status(401).json({error:"Unauthorized. No token found.."});

        const isDecoded=jwt.verify(token,process.env.JWT_SECRET_KEY);     //verifying the token
        
        if(!isDecoded){
            return res.status(401).json({error:"Unauthorized. Invalid token.."});
        }

        
        const user=await User.findById(isDecoded.userId);    //getting it from get and set cookie. This is the object id of user who signed in.
        // console.log(user)
        const data={id:user._id,fullName:user.fullName,userName:user.userName};
        // console.log(data);
        return res.status(200).json(data);

    }catch(error){
        return res.status(500).json({error:"Internal server error"});
    } 
};

export default protectRouteClient;