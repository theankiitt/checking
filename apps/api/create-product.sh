#!/bin/bash

# ============================================
# GharSamma API - Create Product via Curl
# ============================================

API_URL="http://localhost:3001/api/v1"

# Step 1: Login as Admin to get JWT token
echo "🔐 Step 1: Logging in as admin..."

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gharsamma.com",
    "password": "admin123"
  }')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed! No token received."
  echo "Please check your admin credentials."
  exit 1
fi

echo ""
echo "✅ Login successful! Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Create Product with all fields
echo "📦 Step 2: Creating product..."

PRODUCT_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Handwoven Nepali Carpet - Traditional Design",
    "description": "<p>Authentic handwoven carpet made by skilled Nepali artisans using traditional techniques passed down through generations. Made from 100% natural wool with vibrant, long-lasting dyes.</p><p><strong>Features:</strong></p><ul><li>Hand-knotted construction</li><li>Natural wool fibers</li><li>Traditional Nepali patterns</li><li>Eco-friendly dyes</li></ul>",
    "shortDescription": "Authentic handwoven Nepali carpet with traditional patterns",
    "price": 299.99,
    "comparePrice": 499.99,
    "categoryId": "REPLACE_WITH_CATEGORY_ID",
    "sku": "CARPET-NEP-001",
    "barcode": "1234567890123",
    "quantity": 50,
    "trackQuantity": true,
    "lowStockThreshold": 10,
    "allowBackorder": false,
    "manageStock": true,
    "weight": 5.5,
    "weightUnit": "kg",
    "dimensions": {
      "length": 180,
      "width": 120,
      "height": 2,
      "unit": "cm"
    },
    "images": [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800",
      "https://images.unsplash.com/photo-1564078516393-cf04bd96b897?w=800"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400",
    "videos": [
      "https://www.youtube.com/watch?v=example1"
    ],
    "isActive": true,
    "isFeatured": true,
    "isNew": true,
    "isBestSeller": false,
    "isOnSale": true,
    "isDigital": false,
    "visibility": "VISIBLE",
    "seoTitle": "Handwoven Nepali Carpet - Traditional Design | GharSamma",
    "seoDescription": "Buy authentic handwoven Nepali carpets with traditional patterns. Made from 100% natural wool by skilled artisans.",
    "seoKeywords": ["nepali carpet", "handwoven", "traditional", "wool", "authentic"],
    "metaTags": {
      "material": "wool",
      "origin": "Nepal",
      "craft": "handwoven"
    },
    "requiresShipping": true,
    "shippingClass": "standard",
    "freeShipping": false,
    "taxable": true,
    "tags": ["carpet", "handwoven", "nepali", "traditional"],
    "brandId": "REPLACE_WITH_BRAND_ID",
    "customFields": [
      {
        "key": "material",
        "label": "Material",
        "content": "100% Natural Wool",
        "isVisible": true
      },
      {
        "key": "origin",
        "label": "Origin",
        "content": "Kathmandu, Nepal",
        "isVisible": true
      }
    ],
    "currencyPrices": [
      {
        "country": "USA",
        "currency": "USD",
        "symbol": "$",
        "price": 299.99,
        "comparePrice": 499.99,
        "minDeliveryDays": 7,
        "maxDeliveryDays": 14,
        "isActive": true
      },
      {
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "Rs",
        "price": 39999,
        "comparePrice": 59999,
        "minDeliveryDays": 2,
        "maxDeliveryDays": 5,
        "isActive": true
      },
      {
        "country": "India",
        "currency": "INR",
        "symbol": "₹",
        "price": 24999,
        "comparePrice": 39999,
        "minDeliveryDays": 3,
        "maxDeliveryDays": 7,
        "isActive": true
      }
    ],
    "pricingTiers": [
      {
        "minQuantity": 1,
        "maxQuantity": 5,
        "price": 299.99,
        "discount": 0
      },
      {
        "minQuantity": 6,
        "maxQuantity": 10,
        "price": 269.99,
        "discount": 10
      },
      {
        "minQuantity": 11,
        "maxQuantity": null,
        "price": 239.99,
        "discount": 20
      }
    ],
    "attributes": [
      {
        "name": "Material",
        "value": "100% Wool",
        "type": "TEXT",
        "isRequired": true,
        "isFilterable": true,
        "sortOrder": 1
      },
      {
        "name": "Origin",
        "value": "Nepal",
        "type": "TEXT",
        "isRequired": true,
        "isFilterable": true,
        "sortOrder": 2
      },
      {
        "name": "Color",
        "value": "Red",
        "type": "COLOR",
        "isRequired": false,
        "isFilterable": true,
        "sortOrder": 3
      }
    ]
  }')

echo ""
echo "📦 Product Creation Response:"
echo "$PRODUCT_RESPONSE" | jq '.'

# Extract product ID
PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | jq -r '.data.product.id // empty')

if [ -n "$PRODUCT_ID" ]; then
  echo ""
  echo "✅ Product created successfully!"
  echo "🆔 Product ID: $PRODUCT_ID"
  echo "🔗 Product URL: http://localhost:4000/products/carpet/$PRODUCT_ID"
else
  echo ""
  echo "❌ Product creation failed!"
  echo "Error details:"
  echo "$PRODUCT_RESPONSE" | jq '.'
  exit 1
fi
