"use client";

import { MapPin, Package, DollarSign, Info } from "lucide-react";

interface DeliveryOptionsProps {
  deliveryCountry: string;
  deliveryMethod: string;
  selectedCity: string;
  selectedCountry: string;
  selectedDelivery?: { cost: number; days: number };
  etaDate: string;
  onChangeCountry: (country: any) => void;
  onChangeMethod: (method: any) => void;
  onOpenModal: () => void;
}

export default function DeliveryOptions({
  deliveryCountry,
  deliveryMethod,
  selectedCity,
  selectedCountry,
  selectedDelivery,
  etaDate,
  onOpenModal,
}: DeliveryOptionsProps) {
  return (
    <div className="space-y-6">
      <div className="border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-900 text-sm leading-relaxed">
                  {selectedCity}, {selectedCountry}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenModal}
              className="text-black underline px-4 py-1.5 rounded-lg text-sm font-medium hover:text-[#EB6426] transition-colors"
            >
              CHANGE
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delivery Options
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium text-sm capitalize">
                    {deliveryMethod} Delivery
                  </p>
                  <p className="text-gray-500 text-xs">
                    Guaranteed by {etaDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <p className="text-gray-900 text-sm">
                  Cash on Delivery Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Return & Warranty
          </h3>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <p className="text-gray-900 text-sm">14 Days Free Return</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <p className="text-gray-900 text-sm">Warranty not available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
