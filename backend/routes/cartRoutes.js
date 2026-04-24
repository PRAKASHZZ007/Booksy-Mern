import express from "express";
import auth from "../middleware/authMiddleware.js";

import {
  getCart,
  addToCart,
  updateQty,
  deleteItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/:bookId", auth, updateQty);
router.delete("/clear", auth, clearCart);
router.delete("/:bookId", auth, deleteItem);
export default router;