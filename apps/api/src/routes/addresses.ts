import { Router } from "express";
import {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/controllers/addressController";
import { authenticateToken } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

router.get("/", authenticateToken, asyncHandler(getAddresses));
router.get("/:id", authenticateToken, asyncHandler(getAddress));
router.post("/", authenticateToken, asyncHandler(createAddress));
router.patch("/:id", authenticateToken, asyncHandler(updateAddress));
router.delete("/:id", authenticateToken, asyncHandler(deleteAddress));
router.post("/:id/default", authenticateToken, asyncHandler(setDefaultAddress));

export default router;
