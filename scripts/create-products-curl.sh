# =====================================================
# GHARSAMMA E-COMMERCE - PRODUCT CREATION WITH CURL
# =====================================================

# First, let's check the available categories
echo "📂 Available Categories:"
curl -s http://localhost:4444/api/v1/categories | jq '.data.categories[] | "- \(.name) (ID: \(.id))"'

echo ""
echo "📋 Category IDs for reference:"
echo "   - Diamond: cmnaeqial0001w369cd68bfdd"
echo "   - Dress: cmnaeqi7u0000w369w7tgqqll"
echo "   - Handicraft: cmk4sh79w00014wrnwnbddkp3"
echo "   - Statue: cmk4shxdc00034wrnhwfbaf2x"
echo ""

# =====================================================
# OPTION 1: LOGIN AND GET AUTH TOKEN
# =====================================================
echo "🔐 STEP 1: Login to get auth token"
echo "=============================================="
echo "Command:"
echo 'curl -X POST http://localhost:4444/api/v1/auth/login \'
echo '  -H "Content-Type: application/json" \'
echo '  -d \'{"email":"admin@gharsamma.com","password":"admin123"}\''
echo ""

# Example login (uncomment to use)
AUTH_RESPONSE=$(curl -s -X POST http://localhost:4444/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gharsamma.com","password":"admin123"}')

echo "Response:"
echo $AUTH_RESPONSE | jq .

# Extract token (if login successful)
# TOKEN=$(echo $AUTH_RESPONSE | jq -r '.data.accessToken')
# echo "Token: $TOKEN"
echo ""

# =====================================================
# OPTION 2: CREATE PRODUCT WITH AUTH
# =====================================================
echo "📦 STEP 2: Create a Product"
echo "=============================================="
echo ""

echo "Example 1: Diamond Product"
echo "Command:"
cat << 'EOF'
curl -X POST http://localhost:4444/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Diamond Tennis Bracelet",
    "description": "Stunning 18K gold tennis bracelet with brilliant-cut diamonds",
    "categoryId": "cmnaeqial0001w369cd68bfdd",
    "quantity": 15,
    "isActive": true,
    "isFeatured": true,
    "isBestSeller": true,
    "tags": ["diamond", "bracelet", "gold", "jewelry"],
    "currencyPrices": [
      {
        "country": "USA",
        "currency": "USD",
        "symbol": "$",
        "price": 4500,
        "comparePrice": 5500
      },
      {
        "country": "UK",
        "currency": "GBP",
        "symbol": "£",
        "price": 3600,
        "comparePrice": 4400
      },
      {
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "NPR",
        "price": 585000,
        "comparePrice": 715000
      }
    ]
  }'
EOF
echo ""

echo "Example 2: Dress Product"
echo "Command:"
cat << 'EOF'
curl -X POST http://localhost:4444/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Bridal Lehenga Set",
    "description": "Magnificent bridal lehenga with heavy embroidery and mirror work",
    "categoryId": "cmnaeqi7u0000w369w7tgqqll",
    "quantity": 5,
    "isActive": true,
    "isFeatured": true,
    "isBestSeller": true,
    "tags": ["dress", "lehenga", "bridal", "wedding"],
    "currencyPrices": [
      {
        "country": "USA",
        "currency": "USD",
        "symbol": "$",
        "price": 2500,
        "comparePrice": 3000
      },
      {
        "country": "UK",
        "currency": "GBP",
        "symbol": "£",
        "price": 2000,
        "comparePrice": 2400
      },
      {
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "NPR",
        "price": 325000,
        "comparePrice": 390000
      }
    ]
  }'
EOF
echo ""

echo "Example 3: Statue Product"
echo "Command:"
cat << 'EOF'
curl -X POST http://localhost:4444/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Brass Tara Mata Statue",
    "description": "Handcrafted brass statue of Goddess Tara, beautifully detailed",
    "categoryId": "cmk4shxdc00034wrnhwfbaf2x",
    "quantity": 12,
    "isActive": true,
    "isFeatured": true,
    "isNew": true,
    "tags": ["statue", "brass", "religious", "goddess"],
    "currencyPrices": [
      {
        "country": "USA",
        "currency": "USD",
        "symbol": "$",
        "price": 350,
        "comparePrice": 450
      },
      {
        "country": "UK",
        "currency": "GBP",
        "symbol": "£",
        "price": 280,
        "comparePrice": 360
      },
      {
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "NPR",
        "price": 45500,
        "comparePrice": 58500
      }
    ]
  }'
EOF
echo ""

echo "Example 4: Handicraft Product"
echo "Command:"
cat << 'EOF'
curl -X POST http://localhost:4444/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Handcrafted Bamboo Lamp",
    "description": "Eco-friendly bamboo decorative lamp with traditional design",
    "categoryId": "cmk4sh79w00014wrnwnbddkp3",
    "quantity": 25,
    "isActive": true,
    "isNew": true,
    "tags": ["handicraft", "bamboo", "lamp", "home decor"],
    "currencyPrices": [
      {
        "country": "USA",
        "currency": "USD",
        "symbol": "$",
        "price": 65,
        "comparePrice": 85
      },
      {
        "country": "UK",
        "currency": "GBP",
        "symbol": "£",
        "price": 52,
        "comparePrice": 68
      },
      {
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "NPR",
        "price": 8450,
        "comparePrice": 11050
      }
    ]
  }'
EOF
echo ""

# =====================================================
# OPTION 3: CREATE PRODUCT WITH VARIANTS
# =====================================================
echo "🎨 STEP 3: Create Product with Variants"
echo "=============================================="
echo "Command:"
cat << 'EOF'
curl -X POST http://localhost:4444/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Diamond Ring - Size Variants",
    "description": "Beautiful diamond ring available in multiple sizes",
    "categoryId": "cmnaeqial0001w369cd68bfdd",
    "quantity": 50,
    "isActive": true,
    "isFeatured": true,
    "tags": ["diamond", "ring", "jewelry"],
    "currencyPrices": [
      {
        "country": "USA",
        "currency": "USD",
        "symbol": "$",
        "price": 1200
      },
      {
        "country": "UK",
        "currency": "GBP",
        "symbol": "£",
        "price": 960
      },
      {
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "NPR",
        "price": 156000
      }
    ],
    "variants": [
      {
        "name": "Size",
        "value": "US 5",
        "sku": "RNG-DIA-US5",
        "quantity": 10,
        "price": 1200
      },
      {
        "name": "Size",
        "value": "US 6",
        "sku": "RNG-DIA-US6",
        "quantity": 15,
        "price": 1200
      },
      {
        "name": "Size",
        "value": "US 7",
        "sku": "RNG-DIA-US7",
        "quantity": 12,
        "price": 1250
      },
      {
        "name": "Size",
        "value": "US 8",
        "sku": "RNG-DIA-US8",
        "quantity": 13,
        "price": 1250
      }
    ]
  }'
EOF
echo ""

# =====================================================
# OPTION 4: CREATE PRODUCT WITH PRICING TIERS
# =====================================================
echo "💰 STEP 4: Create Product with Pricing Tiers"
echo "=============================================="
echo "Command:"
cat << 'EOF'
curl -X POST http://localhost:4444/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Wholesale Silk Fabric",
    "description": "Premium quality silk fabric, available for wholesale and retail",
    "categoryId": "cmnaeqi7u0000w369w7tgqqll",
    "quantity": 500,
    "isActive": true,
    "tags": ["dress", "silk", "fabric", "wholesale"],
    "currencyPrices": [
      {
        "country": "USA",
        "currency": "USD",
        "symbol": "$",
        "price": 50
      },
      {
        "country": "UK",
        "currency": "GBP",
        "symbol": "£",
        "price": 40
      },
      {
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "NPR",
        "price": 6500
      }
    ],
    "pricingTiers": [
      {
        "minQuantity": 1,
        "maxQuantity": 9,
        "price": 50
      },
      {
        "minQuantity": 10,
        "maxQuantity": 49,
        "price": 45,
        "discount": 10
      },
      {
        "minQuantity": 50,
        "maxQuantity": 99,
        "price": 40,
        "discount": 20
      },
      {
        "minQuantity": 100,
        "maxQuantity": null,
        "price": 35,
        "discount": 30
      }
    ]
  }'
EOF
echo ""

# =====================================================
# OPTION 5: UPDATE EXISTING PRODUCT
# =====================================================
echo "✏️ STEP 5: Update Existing Product"
echo "=============================================="
echo "First, get a product ID:"
echo 'curl -s "http://localhost:4444/api/v1/products?limit=1" | jq ".data.products[0].id"'
echo ""

PRODUCT_ID=$(curl -s "http://localhost:4444/api/v1/products?limit=1" | jq -r '.data.products[0].id')
echo "Product ID: $PRODUCT_ID"
echo ""

echo "Update Command:"
cat << EOF
curl -X PUT http://localhost:4444/api/v1/products/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "quantity": 100,
    "isFeatured": true,
    "isBestSeller": true,
    "tags": ["updated", "featured", "bestseller"]
  }'
EOF
echo ""

# =====================================================
# OPTION 6: ADD ATTRIBUTES TO PRODUCT
# =====================================================
echo "🏷️ STEP 6: Add Attributes to Product"
echo "=============================================="
echo "Command:"
cat << 'EOF'
curl -X POST http://localhost:4444/api/v1/products/PRODUCT_ID/attributes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Material",
    "value": "18K Gold",
    "type": "TEXT",
    "isRequired": true,
    "isFilterable": true,
    "sortOrder": 1
  }'
EOF
echo ""

# =====================================================
# VERIFICATION
# =====================================================
echo "✅ VERIFICATION: Check Created Products"
echo "=============================================="
echo ""
echo "Get all products:"
echo 'curl -s "http://localhost:4444/api/v1/products?limit=10" | jq ".data.products[] | {name, category: .category.name, price}"'
echo ""

echo "Get products by category (Diamond):"
echo 'curl -s "http://localhost:4444/api/v1/products?rawCategory=Diamond&limit=5" | jq ".data.products[] | {name, price}"'
echo ""

echo "Get featured products:"
echo 'curl -s "http://localhost:4444/api/v1/products/featured?limit=5" | jq ".data.products[] | {name, price}"'
echo ""

echo "Get best sellers:"
echo 'curl -s "http://localhost:4444/api/v1/products/best-sellers?limit=5" | jq ".data.products[] | {name, price}"'
echo ""

# =====================================================
# FULL WORKFLOW EXAMPLE
# =====================================================
echo "🚀 FULL WORKFLOW EXAMPLE"
echo "=============================================="
cat << 'EOF'
# Step 1: Login
AUTH_RESPONSE=$(curl -s -X POST http://localhost:4444/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gharsamma.com","password":"admin123"}')

TOKEN=$(echo $AUTH_RESPONSE | jq -r '.data.accessToken')

# Step 2: Create product
curl -X POST http://localhost:4444/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Description here",
    "categoryId": "cmnaeqial0001w369cd68bfdd",
    "quantity": 100,
    "currencyPrices": [
      {"country": "USA", "currency": "USD", "symbol": "$", "price": 100},
      {"country": "Nepal", "currency": "NPR", "symbol": "NPR", "price": 13000}
    ]
  }'

# Step 3: Verify
curl -s "http://localhost:4444/api/v1/products?limit=1" | jq '.data.products[0]'
EOF
echo ""

echo "📚 For more examples, check:"
echo "   - /scripts/create-products-final.ts (Database script)"
echo "   - /apps/api/src/controllers/productController.ts (API logic)"
echo "   - /apps/api/prisma/schema.prisma (Data model)"
