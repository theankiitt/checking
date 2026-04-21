"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { manrope } from "@/app/fonts";

interface DeliveryOptionsProps {
  country: "USA" | "UK" | "Canada" | "Australia";
  setCountry: (country: "USA" | "UK" | "Canada" | "Australia") => void;
}

const COUNTRIES = ["USA", "UK", "Canada", "Australia"] as const;

export default function DeliveryOptions({
  country,
  setCountry,
}: DeliveryOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-orange-600" />
          <div className={`text-left ${manrope.className}`}>
            <p className="text-sm font-medium text-gray-900">{country}</p>
            <p className="text-xs text-gray-500">Standard Delivery</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          <div>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Deliver to
            </p>
            <button
              onClick={() => setShowCountryModal(true)}
              className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {country}
                </span>
              </div>
              <span className="text-xs text-orange-600 font-medium underline">
                Change
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Country Selection Modal */}
      {showCountryModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCountryModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Delivery Country
              </h3>
            </div>
            <div className="p-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCountry(c);
                    setShowCountryModal(false);
                  }}
                  className={`w-full p-3 text-left rounded-lg transition-colors flex items-center justify-between ${
                    country === c
                      ? "bg-orange-50 text-orange-700 font-medium"
                      : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    <span>{c}</span>
                  </div>
                  {country === c && (
                    <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => setShowCountryModal(false)}
                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
