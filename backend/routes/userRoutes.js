import express from "express";
import {
  allUsers,
  authUser,
  userRegister,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", userRegister);
router.post("/login", authUser);
router.get("/", protect, allUsers);
export default router;
