"use client";

import { useState } from "react";
import { Plus, Trash2, Globe } from "lucide-react";
import { ProductFormData, CurrencyPrice } from "../../types/product";
import { CURRENCY_OPTIONS } from "../../constants/productConstants";

interface PricingTabProps {
  formData: ProductFormData;
  onChange: (
    field: "currencyPrices",
    value: CurrencyPrice[],
  ) => void;
}

export default function PricingTab({ formData, onChange }: PricingTabProps) {
  const [currencyPrices, setCurrencyPrices] = useState<CurrencyPrice[]>(
    formData.currencyPrices || [],
  );

  const [newCurrencyPrice, setNewCurrencyPrice] = useState<CurrencyPrice>({
    country: "",
    currency: "USD",
    symbol: "$",
    price: undefined,
    comparePrice: undefined,
    isActive: true,
  });

  const handleAddCurrencyPrice = () => {
    if (newCurrencyPrice.country) {
      const updated = [
        ...currencyPrices,
        { ...newCurrencyPrice, id: Date.now().toString() },
      ];
      setCurrencyPrices(updated);
      onChange("currencyPrices", updated);
      setNewCurrencyPrice({
        country: "",
        currency: "USD",
        symbol: "$",
        price: undefined,
        comparePrice: undefined,
        isActive: true,
      });
    }
  };

  const handleRemoveCurrencyPrice = (id: string) => {
    const updated = currencyPrices.filter((cp) => cp.id !== id);
    setCurrencyPrices(updated);
    onChange("currencyPrices", updated);
  };

  const handleCurrencyChange = (field: keyof CurrencyPrice, value: unknown) => {
    const updated = { ...newCurrencyPrice, [field]: value };
    if (field === "country") {
      const selected = CURRENCY_OPTIONS.find((opt) => opt.country === value);
      if (selected) {
        updated.currency = selected.currency;
        updated.symbol = selected.symbol;
      }
    }
    setNewCurrencyPrice(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              International Pricing
            </h3>
            <p className="text-sm text-gray-500">
              Set different prices for different countries
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCurrencyPrice}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Country Price
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                value={newCurrencyPrice.country}
                onChange={(e) =>
                  handleCurrencyChange("country", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
              >
                <option value="">Select Country</option>
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.country} value={opt.country}>
                    {opt.country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={newCurrencyPrice.currency}
                onChange={(e) =>
                  handleCurrencyChange("currency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbol
              </label>
              <input
                type="text"
                value={newCurrencyPrice.symbol}
                onChange={(e) => handleCurrencyChange("symbol", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={newCurrencyPrice.price ?? ""}
                onChange={(e) =>
                  handleCurrencyChange("price", e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare Price
              </label>
              <input
                type="number"
                step="0.01"
                value={newCurrencyPrice.comparePrice || 0}
                onChange={(e) =>
                  handleCurrencyChange(
                    "comparePrice",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Delivery (days)
              </label>
              <input
                type="number"
                min="1"
                value={newCurrencyPrice.minDeliveryDays || 1}
                onChange={(e) =>
                  handleCurrencyChange(
                    "minDeliveryDays",
                    parseInt(e.target.value) || 1,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Delivery (days)
              </label>
              <input
                type="number"
                min="1"
                value={newCurrencyPrice.maxDeliveryDays || 7}
                onChange={(e) =>
                  handleCurrencyChange(
                    "maxDeliveryDays",
                    parseInt(e.target.value) || 7,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                placeholder="7"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddCurrencyPrice}
            className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Price
          </button>
        </div>

        <div className="space-y-3">
          {currencyPrices.map((cp, index) => (
            <div
              key={cp.id || index}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-3 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Country
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {cp.country}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Currency
                </label>
                <p className="text-sm text-gray-900">{cp.currency}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Price
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {cp.symbol}
                  {cp.price != null ? cp.price.toFixed(2) : "Free"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Compare Price
                </label>
                <p className="text-sm text-gray-600 line-through">
                  {cp.comparePrice
                    ? `${cp.symbol}${Number(cp.comparePrice).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Min Delivery
                </label>
                <p className="text-sm text-gray-900">{cp.minDeliveryDays || 1} days</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Max Delivery
                </label>
                <p className="text-sm text-gray-900">{cp.maxDeliveryDays || 7} days</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${cp.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {cp.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveCurrencyPrice(cp.id || index.toString())
                  }
                  className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
          {currencyPrices.length === 0 && (
            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No country prices added yet</p>
              <p className="text-sm">
                Add prices for different countries above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}