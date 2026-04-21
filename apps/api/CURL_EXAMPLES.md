# ============================================
# Quick Curl Commands - Create Product
# ============================================
# Run these commands one by one in your terminal
# ============================================

# STEP 1: Login and save the token
# Replace admin@gharsamma.com and admin123 with your actual admin credentials
# -------------------------------------------
curl -X POST http://localhost:3001/api/v1/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@gharsamma.com\",\"password\":\"admin123\"}"

# Copy the "token" value from the response
# Example: "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."


# STEP 2: Create product with the token
# Replace YOUR_TOKEN_HERE with the actual token from step 1
# -------------------------------------------
curl -X POST http://localhost:3001/api/v1/products ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"name\":\"Handwoven Nepali Carpet\",\"description\":\"<p>Authentic handwoven carpet from Nepal</p>\",\"shortDescription\":\"Authentic handwoven Nepali carpet\",\"price\":299.99,\"comparePrice\":499.99,\"sku\":\"CARPET-001\",\"quantity\":50,\"trackQuantity\":true,\"lowStockThreshold\":10,\"manageStock\":true,\"weight\":5.5,\"weightUnit\":\"kg\",\"dimensions\":{\"length\":180,\"width\":120,\"height\":2,\"unit\":\"cm\"},\"images\":[\"https://images.unsplash.com/photo-1600166898405-da9535204843?w=800\"],\"thumbnail\":\"https://images.unsplash.com/photo-1600166898405-da9535204843?w=400\",\"isActive\":true,\"isFeatured\":true,\"isNew\":true,\"isOnSale\":true,\"isDigital\":false,\"visibility\":\"VISIBLE\",\"seoTitle\":\"Handwoven Nepali Carpet\",\"seoDescription\":\"Buy authentic Nepali carpets\",\"seoKeywords\":[\"carpet\",\"nepali\",\"handwoven\"],\"currencyPrices\":[{\"country\":\"USA\",\"currency\":\"USD\",\"symbol\":\"$\",\"price\":299.99,\"comparePrice\":499.99,\"minDeliveryDays\":7,\"maxDeliveryDays\":14,\"isActive\":true},{\"country\":\"Nepal\",\"currency\":\"NPR\",\"symbol\":\"Rs\",\"price\":39999,\"comparePrice\":59999,\"minDeliveryDays\":2,\"maxDeliveryDays\":5,\"isActive\":true}]}"


# ============================================
# FULL EXAMPLE (all fields) - Use this for complete product creation
# ============================================
# Replace YOUR_TOKEN_HERE with actual token
# Replace CATEGORY_ID and BRAND_ID with actual IDs from your database
# -------------------------------------------
curl -X POST http://localhost:3001/api/v1/products ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{
    \"name\": \"Premium Bronze Buddha Statue\",
    \"description\": \"<p>Beautiful handcrafted bronze Buddha statue made using traditional lost-wax casting technique by skilled Nepali artisans.</p><ul><li>Handcrafted bronze</li><li>Traditional Nepali design</li><li>Meditation posture</li></ul>\",
    \"shortDescription\": \"Handcrafted bronze Buddha statue - Traditional Nepali design\",
    \"price\": 199.99,
    \"comparePrice\": 349.99,
    \"categoryId\": \"CATEGORY_ID_HERE\",
    \"brandId\": \"BRAND_ID_HERE\",
    \"sku\": \"STATUE-BUD-001\",
    \"barcode\": \"9876543210987\",
    \"quantity\": 25,
    \"trackQuantity\": true,
    \"lowStockThreshold\": 5,
    \"allowBackorder\": false,
    \"manageStock\": true,
    \"weight\": 3.2,
    \"weightUnit\": \"kg\",
    \"dimensions\": {
      \"length\": 25,
      \"width\": 20,
      \"height\": 35,
      \"unit\": \"cm\"
    },
    \"images\": [
      \"https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=800\",
      \"https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800\"
    ],
    \"thumbnail\": \"https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=400\",
    \"isActive\": true,
    \"isFeatured\": true,
    \"isNew\": true,
    \"isBestSeller\": false,
    \"isOnSale\": true,
    \"isDigital\": false,
    \"visibility\": \"VISIBLE\",
    \"seoTitle\": \"Premium Bronze Buddha Statue - Nepali Handcrafted | GharSamma\",
    \"seoDescription\": \"Buy authentic handcrafted bronze Buddha statues from Nepal. Traditional design, meditation posture.\",
    \"seoKeywords\": [\"buddha\", \"statue\", \"bronze\", \"nepali\", \"meditation\"],
    \"currencyPrices\": [
      {
        \"country\": \"USA\",
        \"currency\": \"USD\",
        \"symbol\": \"$\",
        \"price\": 199.99,
        \"comparePrice\": 349.99,
        \"minDeliveryDays\": 10,
        \"maxDeliveryDays\": 20,
        \"isActive\": true
      },
      {
        \"country\": \"Nepal\",
        \"currency\": \"NPR\",
        \"symbol\": \"Rs\",
        \"price\": 26999,
        \"comparePrice\": 44999,
        \"minDeliveryDays\": 1,
        \"maxDeliveryDays\": 3,
        \"isActive\": true
      },
      {
        \"country\": \"India\",
        \"currency\": \"INR\",
        \"symbol\": \"₹\",
        \"price\": 16999,
        \"comparePrice\": 27999,
        \"minDeliveryDays\": 3,
        \"maxDeliveryDays\": 7,
        \"isActive\": true
      }
    ],
    \"pricingTiers\": [
      {
        \"minQuantity\": 1,
        \"maxQuantity\": 3,
        \"price\": 199.99,
        \"discount\": 0
      },
      {
        \"minQuantity\": 4,
        \"maxQuantity\": 10,
        \"price\": 179.99,
        \"discount\": 10
      }
    ]
  }"


# ============================================
# VERIFY: Get the product to confirm it was created
# -------------------------------------------
curl http://localhost:3001/api/v1/products/PRODUCT_ID_HERE


# ============================================
# DELETE: Remove the test product if needed
# -------------------------------------------
curl -X DELETE http://localhost:3001/api/v1/products/PRODUCT_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
