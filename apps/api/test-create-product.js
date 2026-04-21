const http = require('http');

// Step 1: Login to get token
const loginData = JSON.stringify({
  email: 'admin@gharsamma.com',
  password: 'admin123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 4444,
  path: '/api/v1/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let data = '';
  loginRes.on('data', (chunk) => data += chunk);
  loginRes.on('end', () => {
    const result = JSON.parse(data);
    
    if (result.success && result.token) {
      const token = result.token;
      
      // Step 2: Create product with all fields
      const productData = JSON.stringify({
        name: "Premium Cotton Kurta Set",
        slug: "premium-cotton-kurta-set",
        sku: "KURTA-001",
        productCode: "PKS-2024-001",
        barcode: "8901234567890",
        upc: "123456789012",
        ean: "1234567890123",
        isbn: "978-3-16-148410-0",
        description: "Premium quality cotton kurta set with intricate embroidery work. Perfect for festive occasions and daily wear. Made from 100% pure cotton fabric with comfortable fit.",
        shortDescription: "Premium cotton kurta set with embroidery",
        disclaimer: "Colors may vary slightly due to screen settings",
        ingredients: "100% Pure Cotton",
        additionalDetails: "Hand wash recommended. Do not bleach.",
        materialCare: "Machine wash cold, tumble dry low",
        showIngredients: true,
        showDisclaimer: true,
        showAdditionalDetails: true,
        showMaterialCare: true,
        comparePrice: 2499.00,
        costPrice: 1200.00,
        margin: 52,
        currencyPrices: [
          {
            country: "India",
            currency: "INR",
            symbol: "₹",
            price: 1499.00,
            comparePrice: 2499.00,
            minDeliveryDays: 3,
            maxDeliveryDays: 7,
            isActive: true
          },
          {
            country: "United States",
            currency: "USD",
            symbol: "$",
            price: 29.99,
            comparePrice: 49.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
            isActive: true
          }
        ],
        trackQuantity: true,
        quantity: 500,
        lowStockThreshold: 20,
        allowBackorder: false,
        manageStock: true,
        weight: 0.5,
        weightUnit: "kg",
        dimensions: {
          length: 30,
          width: 25,
          height: 5,
          unit: "cm"
        },
        images: [
          "https://example.com/kurta-front.jpg",
          "https://example.com/kurta-back.jpg",
          "https://example.com/kurta-detail.jpg"
        ],
        videos: [
          "https://example.com/kurta-video.mp4"
        ],
        thumbnail: "https://example.com/kurta-thumbnail.jpg",
        seoTitle: "Premium Cotton Kurta Set - Buy Online | GharSamma",
        seoDescription: "Shop premium cotton kurta sets with beautiful embroidery. Free shipping on orders above ₹999. Best prices guaranteed.",
        seoKeywords: ["kurta", "cotton kurta", "ethnic wear", "festive wear", "indian clothing"],
        metaTags: {
          "author": "GharSamma",
          "category": "Clothing"
        },
        ogImage: "https://example.com/kurta-og.jpg",
        canonicalUrl: "https://gharsamma.com/products/premium-cotton-kurta-set",
        twitterCard: "summary_large_image",
        twitterSite: "@gharsamma",
        robotsIndex: true,
        robotsFollow: true,
        ogType: "product",
        seo: {
          ogImage: "https://example.com/kurta-seo.jpg",
          canonicalUrl: "https://gharsamma.com/products/premium-cotton-kurta-set",
          focusKeyword: "cotton kurta set"
        },
        isActive: true,
        isDigital: false,
        isFeatured: true,
        isNew: true,
        isOnSale: true,
        isBestSeller: false,
        isSales: true,
        isNewSeller: false,
        isFestivalOffer: true,
        visibility: "VISIBLE",
        publishedAt: new Date().toISOString(),
        categoryId: "PLACEHOLDER_CATEGORY_ID",
        subCategoryId: "PLACEHOLDER_SUBCATEGORY_ID",
        subSubCategoryId: null,
        tags: ["cotton", "kurta", "ethnic", "festive", "premium", "handmade"],
        brandId: "PLACEHOLDER_BRAND_ID",
        requiresShipping: true,
        shippingClass: "standard",
        freeShipping: true,
        taxable: true,
        taxClass: "standard",
        customFields: [],
        customSections: [
          {
            title: "Size Guide",
            content: "S, M, L, XL, XXL available"
          }
        ],
        notes: "New arrival for festive season 2024",
        pricingTiers: [
          {
            minQuantity: 1,
            maxQuantity: 10,
            price: 1499.00
          },
          {
            minQuantity: 11,
            maxQuantity: 50,
            price: 1399.00
          },
          {
            minQuantity: 51,
            maxQuantity: 100,
            price: 1299.00
          }
        ],
        attributes: [
          {
            name: "Color",
            value: "Navy Blue"
          },
          {
            name: "Pattern",
            value: "Embroidered"
          },
          {
            name: "Fabric",
            value: "Cotton"
          }
        ],
        isVariant: false,
        variantAttributes: [],
        selectedSizes: ["S", "M", "L", "XL", "XXL"],
        selectedColors: ["Navy Blue", "Maroon", "Black"],
        selectedMaterials: ["Cotton"]
      });

      // First, get categories to find a valid ID
      const catOptions = {
        hostname: 'localhost',
        port: 4444,
        path: '/api/v1/categories',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const catReq = http.request(catOptions, (catRes) => {
        let catData = '';
        catRes.on('data', (chunk) => catData += chunk);
        catRes.on('end', () => {
          const catResult = JSON.parse(catData);
          
          let categoryId = null;
          if (catResult.success && catResult.data && catResult.data.categories && catResult.data.categories.length > 0) {
            categoryId = catResult.data.categories[0].id;
          }

          if (!categoryId) {
            return;
          }


          // Update product data with real category ID
          const productObj = JSON.parse(productData);
          productObj.categoryId = categoryId;
          delete productObj.subCategoryId;
          delete productObj.subSubCategoryId;
          delete productObj.brandId;
          const finalProductData = JSON.stringify(productObj);

          const productOptions = {
            hostname: 'localhost',
            port: 4444,
            path: '/api/v1/products',
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(finalProductData)
            }
          };

          const productReq = http.request(productOptions, (productRes) => {
            let productResData = '';
            productRes.on('data', (chunk) => productResData += chunk);
            productRes.on('end', () => {
            });
          });

          productReq.on('error', (e) => {
          });

          productReq.write(finalProductData);
          productReq.end();
        });
      });

      catReq.on('error', (e) => {
      });

      catReq.end();
    } else {
    }
  });
});

loginReq.on('error', (e) => {
});

loginReq.write(loginData);
loginReq.end();
