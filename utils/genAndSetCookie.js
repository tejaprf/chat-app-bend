import jwt from "jsonwebtoken";
const genAndSetCookie=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"                   //token expires in 7 days
    });
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,         //res.cookie(tokenName,token,validity)
        // maxAge:5*1000,
        httpOnly:true,
        sameSite:"None",
        secure:true
    });                   
}


export default genAndSetCookie;
