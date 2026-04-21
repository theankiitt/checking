"use client";

import { useState, useEffect } from "react";
import { X, Send, MessageCircle, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANIMATED_TEXTS = [
  "Customized Export Products",
  "Free Delivery Worldwide",
];

export default function CustomOrderModal({
  isOpen,
  onClose,
}: CustomOrderModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
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

  const selectedPlatform = watch("platform");
  const selectedCountryCode = watch("countryCode");
  const selectedCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
      setCustomOrderSubmitted(false);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ANIMATED_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <button
        onClick={onClose}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+80px)] p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition-colors z-[60]"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center mb-4 mt-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

      

        <div className="p-6 pt-0">
          <div className="h-8 flex items-center justify-center mb-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={textIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-xl font-bold text-gray-900 text-center"
              >
                {ANIMATED_TEXTS[textIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Need something unique? We specialize in producing and exporting
            fully customized products based on your requirements.
          </p>

          {customOrderSubmitted ? (
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Thank You!</h3>
              <p className="text-gray-500 text-sm">We'll contact you soon on {selectedPlatform}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue("platform", "whatsapp")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    selectedPlatform === "whatsapp"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setValue("platform", "viber")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    selectedPlatform === "viber"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  Viber
                </button>
              </div>

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
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCountryDropdown(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 max-h-64 overflow-y-auto">
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
          )}
        </div>
      </div>
    </div>
  );
}
