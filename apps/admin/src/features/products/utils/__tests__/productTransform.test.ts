import {
  generateSku,
  generateAsin,
  transformCurrencyPrices,
  transformVariants,
  transformProductData,
} from "../productTransform";

describe("Product Transform Utilities", () => {
  describe("generateSku", () => {
    it("should generate a SKU with correct prefix", () => {
      const sku = generateSku();
      expect(sku).toMatch(/^SKU-\d+-[a-z0-9]+$/);
    });

    it("should generate unique SKUs", () => {
      const sku1 = generateSku();
      const sku2 = generateSku();
      expect(sku1).not.toBe(sku2);
    });
  });

  describe("generateAsin", () => {
    it("should generate an ASIN with correct prefix", () => {
      const asin = generateAsin();
      expect(asin).toMatch(/^ASIN-\d+-[A-Z0-9]+$/);
    });

    it("should generate uppercase ASINs", () => {
      const asin = generateAsin();
      const code = asin.split("-").slice(2).join("-");
      expect(code).toBe(code.toUpperCase());
    });
  });

  describe("transformCurrencyPrices", () => {
    it("should use provided currency prices if available", () => {
      const currencyPrices = [
        { country: "USA", currency: "USD", symbol: "$", price: 100 },
      ];
      const result = transformCurrencyPrices(currencyPrices, {});
      expect(result).toHaveLength(1);
      expect(result[0].country).toBe("USA");
      expect(result[0].price).toBe(100);
    });

    it("should auto-detect currency from country", () => {
      const currencyPrices = [{ country: "India", price: 1000 }];
      const result = transformCurrencyPrices(currencyPrices, {});
      expect(result[0].currency).toBe("INR");
      expect(result[0].symbol).toBe("₹");
    });

    it("should use default currency price when none provided", () => {
      const result = transformCurrencyPrices([], { price: 50 });
      expect(result).toHaveLength(1);
      expect(result[0].country).toBe("USA");
      expect(result[0].price).toBe(50);
    });

    it("should use default price of 1 when price is 0", () => {
      const result = transformCurrencyPrices([], { price: 0 });
      expect(result[0].price).toBe(1);
    });
  });

  describe("transformVariants", () => {
    it("should return empty array for empty variants", () => {
      const result = transformVariants([]);
      expect(result).toEqual([]);
    });

    it("should transform variant options correctly", () => {
      const variants = [
        {
          name: "Size",
          options: [{ price: "10", weight: "0.5", stock: 5 }],
        },
      ];
      const result = transformVariants(variants);
      expect(result[0].options[0].price).toBe(10);
      expect(result[0].options[0].weight).toBe(0.5);
      expect(result[0].options[0].stock).toBe(5);
    });

    it("should set default values for missing fields", () => {
      const variants = [{ name: "Color", options: [{ name: "Red" }] }];
      const result = transformVariants(variants);
      expect(result[0].options[0].additionalCost).toBe(0);
      expect(result[0].options[0].stock).toBe(0);
    });
  });

  describe("transformProductData", () => {
    it("should generate SKU if not provided (create mode)", () => {
      const result = transformProductData({}, false);
      expect(result.sku).toMatch(/^SKU-\d+-[a-z0-9]+$/);
    });

    it("should not generate SKU in update mode", () => {
      const result = transformProductData({}, true);
      expect(result.sku).toBeUndefined();
    });

    it("should set default boolean values", () => {
      const result = transformProductData({}, false);
      expect(result.trackQuantity).toBe(true);
      expect(result.manageStock).toBe(true);
      expect(result.requiresShipping).toBe(true);
      expect(result.taxable).toBe(true);
    });

    it("should include weight if provided and greater than 0", () => {
      const result = transformProductData(
        { weight: 2.5, weightUnit: "kg" },
        false,
      );
      expect(result.weight).toBe(2.5);
      expect(result.weightUnit).toBe("kg");
    });

    it("should include dimensions if provided", () => {
      const result = transformProductData(
        { dimensions: { length: 10, width: 5, height: 3 } },
        false,
      );
      expect(result.dimensions).toEqual({
        length: 10,
        width: 5,
        height: 3,
        unit: "cm",
      });
    });

    it("should remove currency and symbol fields", () => {
      const result = transformProductData(
        { currency: "USD", symbol: "$" },
        false,
      ) as Record<string, unknown>;
      expect(result.currency).toBeUndefined();
      expect(result.symbol).toBeUndefined();
    });

    it("should transform variants", () => {
      const variants = [{ name: "Size", options: [{ price: "10" }] }];
      const result = transformProductData({ variants }, false);
      expect(result.variants).toBeDefined();
      expect(result.variants[0].options[0].price).toBe(10);
    });
  });
});
