import { Request, Response } from "express";
import { prisma } from "@/config/database";
import { logger } from "@/utils/logger";
import { z } from "zod";

const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  whatsappNumber: z.string().min(1, "WhatsApp or Viber number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  requirement: z.string().optional().or(z.literal("")),
  productId: z.string().optional().nullable(),
  quantity: z.number().optional().default(1),
});

export const createLead = async (req: Request, res: Response) => {
  try {
    const validatedData = createLeadSchema.parse(req.body);

    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        whatsappViber: validatedData.whatsappNumber,
        email: validatedData.email || null,
        requirement: validatedData.requirement || null,
        productId: validatedData.productId || null,
        quantity: validatedData.quantity,
      },
    });

    logger.info("Lead created successfully", { leadId: lead.id, name: lead.name });

    res.status(201).json({
      success: true,
      message: "Quote request submitted successfully",
      data: {
        orderId: lead.id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
      return;
    }

    logger.error("Create lead error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit quote request",
    });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error("Get leads error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: "Status is required",
      });
      return;
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      message: "Lead status updated",
      data: { lead },
    });
  } catch (error) {
    logger.error("Update lead status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lead status",
    });
  }
};
