import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChat,
  removeFromGroup,
  renameChat,
} from "../controllers/chatControllers.js";

const router = express.Router();
router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameChat);
router.put("/groupremove", protect, removeFromGroup);
router.put("/groupadd", protect, addToGroup);

export default router;
