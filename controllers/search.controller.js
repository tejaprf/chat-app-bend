import { User } from "../models/user.model.js";

export const searchUser= async (req,res) =>{
    try {
        const {user}=req.params;
        // console.log(user);
        // options: 'i' makes it case insensitive
      const users = await User.find({ userName: { $regex: user, $options: 'i' } },{userName:1,_id:1});
      if (users.length > 0) {
        console.log('Users found:', users);
        return res.status(201).json({users:users});
      } else {
        console.log('No users found with that substring.');
        return res.status(201).json({users:[]})
      }
    } catch (error) {
      console.error('Error finding users:', error);
      return res.status(400).json({error:"User not found"})
    }
  }
  