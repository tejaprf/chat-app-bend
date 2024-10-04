import express from "express";
import {checkUser, login,logout,signup} from "../controllers/auth.controllers.js"

const router=express.Router();

router.post('/login',login);
router.post('/logout',logout);
router.post('/signup',signup);
router.post('/checkUser/:userName',checkUser);

export default router;

