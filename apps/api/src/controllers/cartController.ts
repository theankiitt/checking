import { Request, Response } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            currencyPrices: {
              where: { isActive: true },
              orderBy: { country: "asc" },
            },
            variants: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                value: true,
                price: true,
                quantity: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const cartTotal = cartItems.reduce((sum, item) => {
      const price = item.product.currencyPrices[0]?.price || 0;
      return sum + Number(price) * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        itemCount: cartItems.length,
        total: cartTotal,
      },
    });
  } catch (error) {
    logger.error("Get cart error:", error);
    throw new AppError("Failed to fetch cart", 500);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId, quantity = 1 } = req.body;

  try {
    if (!productId) {
      throw new AppError("Product ID is required", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { currencyPrices: { where: { isActive: true } } },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (!product.isActive) {
      throw new AppError("Product is not available", 400);
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, quantity },
        include: { product: true },
      });
    }

    logger.info("Cart updated", { userId, productId, quantity });

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: { cartItem },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Add to cart error:", error);
    throw new AppError("Failed to add item to cart", 500);
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    if (quantity < 1) {
      throw new AppError("Quantity must be at least 1", 400);
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });

    res.json({
      success: true,
      message: "Cart item updated",
      data: { cartItem: updatedItem },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Update cart item error:", error);
    throw new AppError("Failed to update cart item", 500);
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { itemId } = req.params;

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Remove from cart error:", error);
    throw new AppError("Failed to remove item from cart", 500);
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    logger.error("Clear cart error:", error);
    throw new AppError("Failed to clear cart", 500);
  }
};
