import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes.js";
import connectToMongo from "./db/connectToMongo.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.route.js"
import userRoute from "./routes/user.routes.js"
import protectRouteClient from "./middleware/protectRouteClient.js";
import searchRoute from './routes/search.route.js'
import {app,server} from './socket/socket.js'

dotenv.config();

app.use(express.json());
// app.use(cors());
app.use(cookieParser());




const PORT=process.env.PORT || 6000;


app.use(cors({
    origin: process.env.FEND_URL, // Replace with your frontend URL
    credentials: true,
  }));

app.use('/auth',authRoute);
app.use('/message',messageRoute);
app.use('/user',userRoute);
app.use('/search',searchRoute);

app.get('/isAuth',protectRouteClient);

app.get('/',(req,res)=>{
    res.send("Hello world");
})


server.listen(PORT,()=>{
    console.log('Backend server started on port ',PORT);
    connectToMongo();
})


