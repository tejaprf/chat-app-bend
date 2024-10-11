import { Server } from "socket.io";
import http from 'http';
import express from "express";

const app=express();

//Normal express server
const server=http.createServer(app);

//Socket server. Enclosing express server in socket server.
const io=new Server(server,{
    cors:{
        origin:process.env.FEND_URL,
        methods:["GET","POST"]
    }
})

// const io=new Server(server);

const userSocketMap={}; //{userId:SocketId}

io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("User connected",socket.id,userId);
    
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    if(userId)
        userSocketMap[userId]=socket.id;
    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id,userId);
        delete userSocketMap[socket.id];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});

export {app,server,io,userSocketMap};