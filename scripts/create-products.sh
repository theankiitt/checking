#!/bin/bash

# Base URL
API_URL="http://localhost:4444/api/v1"

# Login first to get token (replace with actual credentials)
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Failed to get auth token"
  exit 1
fi

echo "Auth Token: $TOKEN"

# Common headers
HEADERS="-H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN'"

# ============================================
# FOODS CATEGORY PRODUCTS
# ============================================

echo "Creating Foods products..."

curl -s -X POST "$API_URL/products" \
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
    "categoryId": "foods_category_id",
    "images": ["/foods/sel-roti.jpg"],
    "isActive": true,
    "isNew": true
  }'

curl -s -X POST "$API_URL/products" \
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
    "categoryId": "foods_category_id",
    "images": ["/foods/yomari.jpg"],
    "isActive": true,
    "isNew": true
  }'

# ============================================
# DRESS CATEGORY PRODUCTS
# ============================================

echo "Creating Dress products..."

curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Elegant Silk Sari",
    "description": "Beautiful handwoven silk sari with traditional embroidery work",
    "shortDescription": "Handwoven silk sari with embroidery",
    "price": 12500,
    "comparePrice": 15000,
    "sku": "DRESS-SAR-001",
    "quantity": 15,
    "categoryId": "dress_category_id",
    "images": ["/dress/sari.jpg"],
    "isActive": true,
    "isFeatured": true
  }'

curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Designer Lehenga Choli",
    "description": "Stunning designer lehenga for special occasions with mirror work",
    "shortDescription": "Designer lehenga with mirror work",
    "price": 18500,
    "comparePrice": 22000,
    "sku": "DRESS-LEH-001",
    "quantity": 8,
    "categoryId": "dress_category_id",
    "images": ["/dress/lehenga.jpg"],
    "isActive": true,
    "isFeatured": true
  }'

# ============================================
# DIAMOND JEWELLERY PRODUCTS
# ============================================

echo "Creating Diamond Jewellery products..."

curl -s -X POST "$API_URL/products" \
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
    "categoryId": "diamond_category_id",
    "images": ["/jewellery/diamond-necklace.jpg"],
    "isActive": true,
    "isFeatured": true,
    "isBestSeller": true
  }'

curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Diamond Stud Earrings",
    "description": "Classic diamond stud earrings in white gold",
    "shortDescription": "Diamond stud earrings in white gold",
    "price": 45000,
    "comparePrice": 55000,
    "sku": "JEW-DIA-EAR-001",
    "quantity": 10,
    "categoryId": "diamond_category_id",
    "images": ["/jewellery/diamond-earrings.jpg"],
    "isActive": true,
    "isFeatured": true
  }'

# ============================================
# CARPET PRODUCTS
# ============================================

echo "Creating Carpet products..."

curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Handwoven Wool Carpet",
    "description": "Authentic Nepalese wool carpet with traditional Tibetan design",
    "shortDescription": "Handwoven wool carpet",
    "price": 25000,
    "comparePrice": 35000,
    "sku": "CARPET-WOOL-001",
    "quantity": 12,
    "categoryId": "carpet_category_id",
    "images": ["/carpet/wool-carpet.jpg"],
    "isActive": true,
    "isFeatured": true
  }'

curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Silk Runner Carpet",
    "description": "Luxurious pure silk runner carpet with floral patterns",
    "shortDescription": "Pure silk runner carpet",
    "price": 45000,
    "comparePrice": 60000,
    "sku": "CARPET-SILK-001",
    "quantity": 6,
    "categoryId": "carpet_category_id",
    "images": ["/carpet/silk-carpet.jpg"],
    "isActive": true,
    "isBestSeller": true
  }'

# ============================================
# STATUE PRODUCTS
# ============================================

echo "Creating Statue products..."

curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Lord Buddha Statue",
    "description": "Hand-carved bronze Buddha statue with traditional Buddhist symbols",
    "shortDescription": "Hand-carved bronze Buddha statue",
    "price": 15000,
    "comparePrice": 20000,
    "sku": "STAT-BUD-001",
    "quantity": 8,
    "categoryId": "statue_category_id",
    "images": ["/statues/buddha.jpg"],
    "isActive": true,
    "isFeatured": true
  }'

curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Hindu God Ganesh Statue",
    "description": "Traditional Ganesh idol made of polyresin with gold finish",
    "shortDescription": "Ganesh statue with gold finish",
    "price": 3500,
    "comparePrice": 5000,
    "sku": "STAT-GAN-001",
    "quantity": 20,
    "categoryId": "statue_category_id",
    "images": ["/statues/ganesh.jpg"],
    "isActive": true,
    "isBestSeller": true
  }'

echo "Products created successfully!"
