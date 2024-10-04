import express from "express";
import { searchUser } from "../controllers/search.controller.js";

const router=express.Router();
router.get('/:user',searchUser);

export default router;