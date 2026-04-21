import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/controllers/cartController";
import { authenticateToken } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

router.get("/", authenticateToken, asyncHandler(getCart));
router.post("/", authenticateToken, asyncHandler(addToCart));
router.patch("/:itemId", authenticateToken, asyncHandler(updateCartItem));
router.delete("/:itemId", authenticateToken, asyncHandler(removeFromCart));
router.delete("/", authenticateToken, asyncHandler(clearCart));

export default router;
