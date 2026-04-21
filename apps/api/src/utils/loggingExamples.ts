import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

export const loginWithLogging = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  try {
    req.logger?.info("Login attempt", { email });

    // ... existing login logic ...

    // Success
    logger.info("Login successful", {
      email,
    });

    res.json({ success: true });
  } catch (error: any) {
    // Failed login
    logger.error("Login failed", {
      email,
      error: error.message,
    });

    next(error);
  }
};

export const createProductWithLogging = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.logger?.info("Creating product", {
      name: req.body.name,
      price: req.body.price,
    });

    // ... existing product creation logic ...

    req.logger?.info("Product created", {
      name: req.body.name,
    });

    res.status(201).json({ success: true });
  } catch (error: any) {
    req.logger?.error("Product creation failed", {
      error: error.message,
    });
    next(error);
  }
};

export const updateProductWithLogging = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    req.logger?.info("Updating product", {
      productId: id,
      changes: req.body,
    });

    // ... existing product update logic ...

    req.logger?.info("Product updated", {
      productId: id,
    });

    res.json({ success: true });
  } catch (error: any) {
    req.logger?.error("Product update failed", {
      productId: id,
      error: error.message,
    });
    next(error);
  }
};

export const deleteProductWithLogging = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    req.logger?.info("Deleting product", {
      productId: id,
    });

    // ... existing product deletion logic ...

    req.logger?.info("Product deleted", {
      productId: id,
    });

    res.status(204).send();
  } catch (error: any) {
    req.logger?.error("Product deletion failed", {
      productId: id,
      error: error.message,
    });
    next(error);
  }
};
