import express, { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getFriends } from "../controllers/user.controller.js";

const router=express.Router();
router.get('/getFriends',protectRoute,getFriends);

export default router;