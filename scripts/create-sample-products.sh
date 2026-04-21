#!/bin/bash

# ============================================
# SIMPLE CREATE PRODUCTS CURL COMMANDS
# Run after starting API: pnpm dev in apps/api
# ============================================

API_URL="http://localhost:4444/api/v1"

echo "============================================"
echo "Creating Categories and Products"
echo "============================================"

# First, get auth token (use your admin credentials)
echo "1. Login to get token..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')

echo "Response: $TOKEN_RESPONSE"

# Extract token (adjust based on actual response)
TOKEN="your_jwt_token_here"

# ============================================
# FOODS PRODUCTS
# ============================================
echo ""
echo "2. Creating Foods products..."

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Traditional Sel Roti",
    "description": "Authentic Nepali rice bread, crispy on outside and soft inside",
    "shortDescription": "Crispy traditional Nepali rice bread",
    "price": 150,
    "comparePrice": 200,
    "sku": "FOOD-SEL-001",
    "quantity": 50,
    "category": "Foods",
    "isActive": true,
    "isNew": true
  }'

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Fresh Yomari",
    "description": "Traditional Newari rice cake filled with molasses and coconut",
    "shortDescription": "Traditional Newari sweet dumpling",
    "price": 80,
    "comparePrice": 100,
    "sku": "FOOD-YOM-001",
    "quantity": 30,
    "category": "Foods",
    "isActive": true
  }'

# ============================================
# DRESS PRODUCTS
# ============================================
echo ""
echo "3. Creating Dress products..."

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Elegant Silk Sari",
    "description": "Beautiful handwoven silk sari with traditional embroidery work",
    "shortDescription": "Handwoven silk sari",
    "price": 12500,
    "comparePrice": 15000,
    "sku": "DRESS-SAR-001",
    "quantity": 15,
    "category": "Dress",
    "isActive": true,
    "isFeatured": true
  }'

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Designer Lehenga Choli",
    "description": "Stunning designer lehenga for special occasions",
    "shortDescription": "Designer lehenga with mirror work",
    "price": 18500,
    "comparePrice": 22000,
    "sku": "DRESS-LEH-001",
    "quantity": 8,
    "category": "Dress",
    "isActive": true,
    "isFeatured": true
  }'

# ============================================
# DIAMOND PRODUCTS
# ============================================
echo ""
echo "4. Creating Diamond Jewellery products..."

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Diamond Gold Necklace",
    "description": "Elegant 18K gold necklace with certified diamonds",
    "shortDescription": "18K gold necklace with diamonds",
    "price": 125000,
    "comparePrice": 150000,
    "sku": "JEW-DIA-NEK-001",
    "quantity": 5,
    "category": "Diamond",
    "isActive": true,
    "isFeatured": true,
    "isBestSeller": true
  }'

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Diamond Stud Earrings",
    "description": "Classic diamond stud earrings in white gold",
    "shortDescription": "Diamond stud earrings",
    "price": 45000,
    "comparePrice": 55000,
    "sku": "JEW-DIA-EAR-001",
    "quantity": 10,
    "category": "Diamond",
    "isActive": true,
    "isFeatured": true
  }'

# ============================================
# CARPET PRODUCTS
# ============================================
echo ""
echo "5. Creating Carpet products..."

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Handwoven Wool Carpet",
    "description": "Authentic Nepalese wool carpet with traditional design",
    "shortDescription": "Handwoven wool carpet",
    "price": 25000,
    "comparePrice": 35000,
    "sku": "CARPET-WOOL-001",
    "quantity": 12,
    "category": "Carpet",
    "isActive": true,
    "isFeatured": true
  }'

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Silk Runner Carpet",
    "description": "Luxurious pure silk runner carpet",
    "shortDescription": "Pure silk runner carpet",
    "price": 45000,
    "comparePrice": 60000,
    "sku": "CARPET-SILK-001",
    "quantity": 6,
    "category": "Carpet",
    "isActive": true,
    "isBestSeller": true
  }'

# ============================================
# STATUE PRODUCTS
# ============================================
echo ""
echo "6. Creating Statue products..."

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Lord Buddha Statue",
    "description": "Hand-carved bronze Buddha statue",
    "shortDescription": "Hand-carved bronze Buddha",
    "price": 15000,
    "comparePrice": 20000,
    "sku": "STAT-BUD-001",
    "quantity": 8,
    "category": "Statues",
    "isActive": true,
    "isFeatured": true
  }'

curl -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Hindu God Ganesh Statue",
    "description": "Traditional Ganesh idol with gold finish",
    "shortDescription": "Ganesh statue",
    "price": 3500,
    "comparePrice": 5000,
    "sku": "STAT-GAN-001",
    "quantity": 20,
    "category": "Statues",
    "isActive": true,
    "isBestSeller": true
  }'

echo ""
echo "============================================"
echo "Done! Products created."
echo "============================================"
