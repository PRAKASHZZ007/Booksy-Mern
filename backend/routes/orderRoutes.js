import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrders,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getOrders);
router.delete("/:id", auth, deleteOrder);

export default router;