import { Request, Response } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

export const getAddresses = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    res.json({
      success: true,
      data: { addresses },
    });
  } catch (error) {
    logger.error("Get addresses error:", error);
    throw new AppError("Failed to fetch addresses", 500);
  }
};

export const getAddress = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  try {
    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    res.json({
      success: true,
      data: { address },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Get address error:", error);
    throw new AppError("Failed to fetch address", 500);
  }
};

export const createAddress = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { type, street, city, state, zipCode, country, isDefault } = req.body;

  try {
    if (!street || !city || !state || !zipCode || !country) {
      throw new AppError("All address fields are required", 400);
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, type },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        type: type || "SHIPPING",
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      },
    });

    logger.info("Address created", { userId, addressId: address.id });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: { address },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Create address error:", error);
    throw new AppError("Failed to create address", 500);
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { type, street, city, state, zipCode, country, isDefault } = req.body;

  try {
    const existing = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError("Address not found", 404);
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, type: type || existing.type },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(street && { street }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(country && { country }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    logger.info("Address updated", { userId, addressId: id });

    res.json({
      success: true,
      message: "Address updated successfully",
      data: { address },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Update address error:", error);
    throw new AppError("Failed to update address", 500);
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  try {
    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    await prisma.address.delete({ where: { id } });

    logger.info("Address deleted", { userId, addressId: id });

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Delete address error:", error);
    throw new AppError("Failed to delete address", 500);
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { type = "SHIPPING" } = req.body;

  try {
    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, type },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);

    res.json({
      success: true,
      message: "Default address set successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Set default address error:", error);
    throw new AppError("Failed to set default address", 500);
  }
};
