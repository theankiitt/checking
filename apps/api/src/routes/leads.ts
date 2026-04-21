import { Router } from "express";
import { createLead, getLeads, updateLeadStatus } from "@/controllers/leadController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

router.post("/leads", asyncHandler(createLead));

router.get("/leads", authenticateToken, authorize("ADMIN"), asyncHandler(getLeads));

router.patch("/leads/:id/status", authenticateToken, authorize("ADMIN"), asyncHandler(updateLeadStatus));

export default router;
