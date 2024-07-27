import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";

const router= express.Router();
router.get("/profile:username",protectRoute, getUserProfile);
export default router;