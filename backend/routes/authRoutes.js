import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("Auth Routes Loaded ✅");

router.post("/register", registerUser);
router.post("/login", loginUser);

// 👇 THIS IS IMPORTANT
router.get("/me", authMiddleware, getUser);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete", authMiddleware, deleteUser);

export default router;