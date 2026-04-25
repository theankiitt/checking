"use client";

import { useState } from "react";
import { Send, MessageCircle, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const COUNTRIES = [
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
];

const customOrderSchema = z.object({
  platform: z.enum(["whatsapp", "viber"]),
  countryCode: z.string().min(1, "Select a country"),
  phoneNumber: z.string().min(7, "Enter a valid phone number").max(15, "Phone number too long"),
  description: z.string().max(500, "Description too long").optional(),
});

type CustomOrderForm = z.infer<typeof customOrderSchema>;

export default function CustomOrderForm({ categorySlug }: { categorySlug?: string }) {
  const [customOrderSubmitted, setCustomOrderSubmitted] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm<CustomOrderForm>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      platform: "whatsapp",
      countryCode: "NP",
      phoneNumber: "",
      description: "",
    },
  });

  const selectedCountryCode = watch("countryCode");
  const selectedCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  const onSubmit = async (data: CustomOrderForm) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
      const response = await fetch(`${API_BASE_URL}/api/v1/customization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: data.platform,
          countryCode: data.countryCode,
          phoneNumber: data.phoneNumber,
          description: data.description,
          category: categorySlug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setCustomOrderSubmitted(true);
      reset();
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  if (customOrderSubmitted) {
    return (
      <div className="bg-green-50 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Send className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Thank You!</h3>
        <p className="text-gray-500 text-sm">We'll contact you soon on WhatsApp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="h-12 px-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors flex items-center gap-2 hover:bg-gray-100"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountry.dial}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showCountryDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowCountryDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => { setValue("countryCode", country.code); setShowCountryDropdown(false); }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                      selectedCountryCode === country.code ? "bg-orange-50" : ""
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-sm text-gray-900">{country.name}</span>
                    <span className="text-sm text-gray-500">{country.dial}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex-1">
          <input
            type="tel"
            {...register("phoneNumber")}
            placeholder="Phone number"
            className={`w-full h-12 px-4 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 focus:outline-none transition-colors ${
              errors.phoneNumber ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-orange-500"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <textarea
          {...register("description")}
          placeholder="Describe what you're looking for (optional)"
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
