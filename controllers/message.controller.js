import express from "express";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { Friend } from "../models/user.friends.js";
import { io, userSocketMap } from "../socket/socket.js";

export const sendMessage=async (req,res)=>{
    console.log("Send Message");
    try{
        const {id:receiverId}=req.params;           //defined in route /send/:id or const id=req.params.id
        const senderId=req.user._id;           //assigned it in middle ware.
        const message=req.body.message;
        
        console.log("Sender Id ",senderId);
        console.log("Receiver Id ",receiverId);


        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]},
        })
    
        //both snippets do the same task. First one using Model.create and 2nd one using new Model()
        // if(!conversation){
        //     console.log("No conversation");
        //     conversation=await Conversation.create({
        //         participants:[senderId,receiverId],
        //     })
        // }

        // const newMessage=await Message.create({
        //     senderId,receiverId,message
        // })
        // conversation.messages.push(newMessage._id);

        // await newMessage.save();
        // await conversation.save();
        if(!conversation){
            console.log("No conversation");
            conversation=new Conversation({
                participants:[senderId,receiverId],
                messages:[]
            })
            // let friend1=new Friend({
            //     curUser: senderId,
            //     friends:[]
            // })
            // await friend1.save();
            // friend1=new Friend({
            //     curUser: receiverId,
            //     friends:[]
            // })
            // await friend1.save();


            let friend=await Friend.findOne({curUser:senderId});
            friend.friends.push(receiverId);
            friend.save();

            friend=await Friend.findOne({curUser:receiverId});
            friend.friends.push(senderId);
            friend.save();
        }

        const newMessage=new Message({
            senderId,receiverId,message
        })
        conversation.messages.push(newMessage._id);
        await Promise.all([newMessage.save(),conversation.save()]);

        
        
        const receiverSocket=userSocketMap[receiverId];

        if(receiverSocket){
            // io.to(<socketid>).emit("eventName",data);   when we call this event using socket io client, then we get this data    
            io.to(receiverSocket).emit("newMessage",newMessage);
        }

        // await newMessage.save();
        // await conversation.save();
        // Above is sequential. Below is parallel execution

        console.log("Message Controller - Send Message ",newMessage)
        // return res.status(201).json({data:newMessage,message:"Conversation and Message saved successfully"});
        return res.status(201).json({messageVal:newMessage,message:"Conversation and Message saved successfully"});

        

    }catch(err){
        console.log("Error in the message controller",err);
        return res.status(501).json({error:"Internal Server Error"});
    }
}

// For getting all messages in a chat
export const getMessage=async (req,res)=>{
    console.log("get Message");
    try{
        const {id:userToChat}=req.params;           //defined in route /send/:id or const id=req.params.id
        const senderId=req.user._id;           //assigned it in middle ware.

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,userToChat]},
        }).populate("messages");
    
        if(!conversation){
            return res.status(200).json([]);
        }
        // console.log("Messages fetched ",conversation.messages);
        return res.status(200).json(conversation.messages);

    }catch(err){
        console.log("Error in the get message controller");
        return res.status(501).json({error:"Internal Server Error"});
    }
}