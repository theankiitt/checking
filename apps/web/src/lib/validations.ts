import { z } from "zod";

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

// Product validation schemas
export const productReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().optional(),
  comment: z.string().min(1, "Comment is required").max(1000, "Comment must be less than 1000 characters"),
});

// Cart validation schemas
export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be positive"),
  image: z.string(),
});

// Wishlist validation schema
export const wishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

// Search validation schema
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(100, "Search query too long"),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// Order validation schema
export const orderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Order must have at least one item"),
  shippingAddress: z.object({
    fullName: z.string().min(1, "Full name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  paymentMethod: z.enum(["cod", "card", "paypal"]),
});

// Helper function to validate and parse data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(", ")}`);
    }
    throw error;
  }
}
