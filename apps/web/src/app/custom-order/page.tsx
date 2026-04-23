"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Scissors, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { manrope } from "../fonts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const productCategories = [
  "Clothing",
  "Jewellery",
  "Handicraft",
  "Home Decor",
  "Food & Spices",
  "Other",
];

const customizationTypes = [
  "Custom Size/Fit",
  "Custom Design",
  "Custom Color",
  "Custom Material",
  "Other",
];

const customOrderSchema = z
  .object({
    category: z.string().min(1, "Please select a product category."),
    customizationType: z
      .string()
      .min(1, "Please select a customization type."),
    productName: z.string().min(1, "Product name is required."),
    description: z
      .string()
      .min(20, "Please describe your requirements in at least 20 characters."),
    budget: z.string().optional(),
    deadline: z.string().optional(),
    contactMethod: z.enum(["email", "phone"]),
    phone: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.contactMethod === "phone" && !value.phone?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Phone number is required when contacting by phone.",
      });
    }
  });

type CustomOrderFormValues = z.infer<typeof customOrderSchema>;

export default function CustomOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CustomOrderFormValues>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      category: "",
      customizationType: "",
      productName: "",
      description: "",
      budget: "",
      deadline: "",
      contactMethod: "email",
      phone: "",
    },
  });

  const contactMethod = watch("contactMethod");

  const onSubmit = async (data: CustomOrderFormValues) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/customization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSubmitted(true);
        toast.success("Customization request submitted successfully!");
      } else {
        throw new Error(result.message || "Failed to submit request");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-gray-50 py-12 ${manrope.className}`}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Request Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              We have received your custom order request. Our team will contact
              you within 24-48 hours to discuss the details.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#EB6426] text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${manrope.className}`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#EB6426] rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Custom Order</h1>
              <p className="text-gray-600">
                Tell us what you need and we will handle your custom order.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block  font-medium text-black text-lg mb-2">
                Product Category *
              </label>
              <select
                {...register("category")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {productCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block  font-medium text-black text-lg mb-2">
                Customization Type *
              </label>
              <select
                {...register("customizationType")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${
                  errors.customizationType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select customization type</option>
                {customizationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.customizationType && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.customizationType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-black text-lg mb-2">
                Product Name / Title *
              </label>
              <input
                type="text"
                {...register("productName")}
                placeholder="Enter the product name or title"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${
                  errors.productName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.productName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-black text-lg mb-2">
                Detailed Requirements *
              </label>
              <textarea
                rows={6}
                {...register("description")}
                placeholder="Describe your customization requirements in detail."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-black text-lg mb-2">
                  Budget (Optional)
                </label>
                <input
                  type="text"
                  {...register("budget")}
                  placeholder="e.g. $150 - $300"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-medium text-black text-lg mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  {...register("deadline")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block  font-medium text-black text-lg mb-2">
                Preferred Contact Method *
              </label>
              <select
                {...register("contactMethod")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${
                  errors.contactMethod ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
              {errors.contactMethod && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.contactMethod.message}
                </p>
              )}
            </div>

            {contactMethod === "phone" && (
              <div>
                <label className="block  font-medium text-black text-lg mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="Enter your phone number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#EB6426] hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Custom Order"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto inline-flex items-center justify-center border border-gray-300 text-black text-lg px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
