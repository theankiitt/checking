"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShoppingBag, Trash2, ArrowRight, MessageCircle, AlertCircle, Scale, ChevronDown } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
];

const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  email: z.string().email("Invalid email address"),
  requirement: z.string().optional(),
});

type FormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  productId?: string | null;
  quantity?: number;
  variant?: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  productId,
  quantity = 1,
  variant = 0,
}) => {
  const router = useRouter();
  const {
    cartItems,
    cartTotal,
    clearCart,
    removeFromCart,
    updateQuantity,
    isLoaded,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+977");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      whatsappNumber: "",
      email: "",
      requirement: "",
    },
  });

  const directProduct = productId ? { id: productId, quantity, variant } : null;
  const itemsToCheckout = directProduct ? [directProduct] : cartItems || [];

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5555";
      return `${baseUrl}${url}`;
    }
    return url;
  };

  useEffect(() => {
    if (isLoaded && !productId && itemsToCheckout.length === 0 && !submitted) {
      router.push("/cart");
    }
  }, [isLoaded, itemsToCheckout, router, productId, submitted]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

      const response = await fetch(`${API_BASE_URL}/api/v1/orders/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          productId: itemsToCheckout[0]?.id || null,
          quantity: itemsToCheckout[0]?.quantity || 1,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        setSubmitted(true);

        if (!directProduct) {
          clearCart();
        }

        const itemsList = itemsToCheckout
          .map((item: any) => `${item.name} x${item.quantity || 1}`)
          .join("\n");

        const whatsappMessage = encodeURIComponent(
          `Hi! I'm interested in getting a quote.\n\nItems:\n${itemsList}\n\nRequirement: ${data.requirement || "None"}`
        );

        window.open(`https://wa.me/9779814768889?text=${whatsappMessage}`, "_blank");

        router.push(`/checkout/success?orderId=${result.data?.orderId || ""}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to submit. Please try again.");
      }
    } catch (error) {
      alert("There was an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#EB6426] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-manrope">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Get Quote</h1>
          <Link
            href="/cart"
            className="text-[#EB6426] hover:text-[#d55a22] flex items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Scale className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Note: Order needs to be over 5 kg
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Products can be different - mix and match as needed to meet the minimum order quantity.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-200"}`}
                        />
                      )}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number *
                    </label>
                    <div className="relative flex items-center">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center gap-2 px-3 py-3 border border-r-0 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span>{COUNTRY_CODES.find(c => c.code === selectedCountryCode)?.flag}</span>
                          <span className="text-sm font-medium">{selectedCountryCode}</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg">
                            {COUNTRY_CODES.map((country) => (
                              <button
                                key={country.code + country.country}
                                type="button"
                                onClick={() => {
                                  setSelectedCountryCode(country.code);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-orange-50 flex items-center gap-2"
                              >
                                <span>{country.flag}</span>
                                <span className="text-sm">{country.country}</span>
                                <span className="text-xs text-gray-500 ml-auto">{country.code}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <Controller
                        name="whatsappNumber"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="tel"
                            placeholder="Enter your WhatsApp number"
                            className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${errors.whatsappNumber ? "border-red-500" : "border-gray-200"}`}
                          />
                        )}
                      />
                    </div>
                    {errors.whatsappNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.whatsappNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          placeholder="Enter your email address"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-200"}`}
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Requirement
                    </label>
                    <Controller
                      name="requirement"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="Describe what you need (optional)..."
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#EB6426] focus:border-transparent ${errors.requirement ? "border-red-500" : "border-gray-200"}`}
                        />
                      )}
                    />
                    {errors.requirement && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.requirement.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || itemsToCheckout.length === 0}
                className="w-full bg-[#EB6426] hover:bg-[#d55a22] disabled:bg-gray-300 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Quote
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Selected Product
              </h2>

              <div className="space-y-4">
                {itemsToCheckout.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={getImageUrl(item.image) || "/product-placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity || 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-500">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-sm text-[#EB6426] font-semibold">
                        NPR {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <MessageCircle className="h-4 w-4 inline mr-1" />
                  We will contact you on WhatsApp with the quote!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;