"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, CheckCircle, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { manrope } from "@/app/fonts";

const COUNTRIES = [
  { code: "NP", dial: "+977", flag: "🇳🇵" },
  { code: "US", dial: "+1", flag: "🇺🇸" },
  { code: "GB", dial: "+44", flag: "🇬🇧" },
  { code: "AU", dial: "+61", flag: "🇦🇺" },
  { code: "CA", dial: "+1", flag: "🇨🇦" },
  { code: "IN", dial: "+91", flag: "🇮🇳" },
  { code: "AE", dial: "+971", flag: "🇦🇪" },
  { code: "JP", dial: "+81", flag: "🇯🇵" },
  { code: "DE", dial: "+49", flag: "🇩🇪" },
  { code: "FR", dial: "+33", flag: "🇫🇷" },
  { code: "IT", dial: "+39", flag: "🇮🇹" },
  { code: "ES", dial: "+34", flag: "🇪🇸" },
  { code: "BR", dial: "+55", flag: "🇧🇷" },
  { code: "MX", dial: "+52", flag: "🇲🇽" },
  { code: "KR", dial: "+82", flag: "🇰🇷" },
  { code: "CN", dial: "+86", flag: "🇨🇳" },
  { code: "SG", dial: "+65", flag: "🇸🇬" },
  { code: "MY", dial: "+60", flag: "🇲🇾" },
  { code: "TH", dial: "+66", flag: "🇹🇭" },
  { code: "NZ", dial: "+64", flag: "🇳🇿" },
  { code: "ZA", dial: "+27", flag: "🇿🇦" },
  { code: "SA", dial: "+966", flag: "🇸🇦" },
  { code: "QA", dial: "+974", flag: "🇶🇦" },
  { code: "KW", dial: "+965", flag: "🇰🇼" },
  { code: "BH", dial: "+973", flag: "🇧🇭" },
  { code: "OM", dial: "+968", flag: "🇴🇲" },
  { code: "BD", dial: "+880", flag: "🇧🇩" },
  { code: "PK", dial: "+92", flag: "🇵🇰" },
  { code: "LK", dial: "+94", flag: "🇱🇰" },
  { code: "PH", dial: "+63", flag: "🇵🇭" },
  { code: "ID", dial: "+62", flag: "🇮🇩" },
  { code: "VN", dial: "+84", flag: "🇻🇳" },
  { code: "EG", dial: "+20", flag: "🇪🇬" },
  { code: "NG", dial: "+234", flag: "🇳🇬" },
  { code: "KE", dial: "+254", flag: "🇰🇪" },
  { code: "GH", dial: "+233", flag: "🇬🇭" },
  { code: "RU", dial: "+7", flag: "🇷🇺" },
  { code: "TR", dial: "+90", flag: "🇹🇷" },
  { code: "NL", dial: "+31", flag: "🇳🇱" },
  { code: "SE", dial: "+46", flag: "🇸🇪" },
  { code: "NO", dial: "+47", flag: "🇳🇴" },
  { code: "DK", dial: "+45", flag: "🇩🇰" },
  { code: "FI", dial: "+358", flag: "🇫🇮" },
  { code: "CH", dial: "+41", flag: "🇨🇭" },
  { code: "AT", dial: "+43", flag: "🇦🇹" },
  { code: "BE", dial: "+32", flag: "🇧🇪" },
  { code: "PT", dial: "+351", flag: "🇵🇹" },
  { code: "IE", dial: "+353", flag: "🇮🇪" },
  { code: "PL", dial: "+48", flag: "🇵🇱" },
  { code: "CZ", dial: "+420", flag: "🇨🇿" },
  { code: "HU", dial: "+36", flag: "🇭🇺" },
  { code: "RO", dial: "+40", flag: "🇷🇴" },
  { code: "GR", dial: "+30", flag: "🇬🇷" },
  { code: "IL", dial: "+972", flag: "🇮🇱" },
  { code: "AR", dial: "+54", flag: "🇦🇷" },
  { code: "CL", dial: "+56", flag: "🇨🇱" },
  { code: "CO", dial: "+57", flag: "🇨🇴" },
  { code: "PE", dial: "+51", flag: "🇵🇪" },
  { code: "VE", dial: "+58", flag: "🇻🇪" },
  { code: "UA", dial: "+380", flag: "🇺🇦" },
];

const customOrderSchema = z.object({
  countryCode: z.string().min(1, "Select a country code"),
  phoneNumber: z.string().min(7, "Enter a valid WhatsApp number").max(15, "Number too long"),
  description: z.string().max(500, "Description too long").optional(),
});

type CustomOrderForm = z.infer<typeof customOrderSchema>;

export default function CustomOrderSection() {
  const [submitted, setSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm<CustomOrderForm>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: { countryCode: "NP", phoneNumber: "", description: "" },
  });

  const selectedCountryCode = watch("countryCode");
  const selectedCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dial.includes(searchQuery)
  );

  const onSubmit = async (data: CustomOrderForm) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5555";
      const response = await fetch(`${API_BASE_URL}/api/v1/customization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: "whatsapp",
          countryCode: data.countryCode,
          phoneNumber: data.phoneNumber,
          description: data.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitted(true);
      reset();
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
         
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 ${manrope.className} mb-4`}>
            Need Something <span className="text-[#EB6426]">Custom?</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Share your WhatsApp number and we'll get in touch to discuss your custom order.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className={`text-xl font-bold text-gray-900 ${manrope.className} mb-2`}>
                Thank You!
              </h3>
              <p className="text-gray-500">
                We'll contact you on WhatsApp shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-green-600 text-sm font-medium hover:underline"
              >
                Submit another number
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
              
                <div>
                  <h3 className={`font-semibold text-gray-900 text-base ${manrope.className}`}>WhatsApp Number</h3>
                  <p className="text-sm text-gray-700">We'll reach out to you here</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="h-12 px-3 rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-[#EB6426] focus:outline-none transition-colors flex items-center gap-1.5 hover:bg-gray-200"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm font-medium text-gray-700">{selectedCountry.dial}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {showDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => { setShowDropdown(false); setSearchQuery(""); }} />
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 flex flex-col max-h-72">
                          <div className="p-2 border-b border-gray-100 flex-shrink-0">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search code..."
                              className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#EB6426]"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="overflow-y-auto flex-1 py-1" onWheel={(e) => e.stopPropagation()}>
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setValue("countryCode", country.code);
                                    setSearchQuery("");
                                    setShowDropdown(false);
                                  }}
                                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                                    selectedCountryCode === country.code ? "bg-green-50" : ""
                                  }`}
                                >
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-sm font-medium text-gray-900">{country.dial}</span>
                                </button>
                              ))
                            ) : (
                              <p className="px-4 py-3 text-sm text-gray-400 text-center">No results found</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    type="tel"
                    {...register("phoneNumber")}
                    placeholder="98XXXXXXXX"
                    className={`flex-1 h-12 px-4 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 focus:outline-none transition-colors ${
                      errors.phoneNumber ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-[#EB6426]"
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  {...register("description")}
                  placeholder="Describe what you're looking for..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border-2 border-gray-200 focus:border-[#EB6426] focus:outline-none transition-colors resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.description.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3.5 bg-[#EB6426] text-white rounded-xl font-semibold hover:bg-[#d55a21] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <a
                href="https://wa.me/9779814768889?text=Hi!%20I'm%20interested%20in%20customizing%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#EB6426] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#d55a21] transition-colors shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              <p className="text-xs text-gray-400 text-center mt-4">
                By submitting, you agree to be contacted via WhatsApp
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
