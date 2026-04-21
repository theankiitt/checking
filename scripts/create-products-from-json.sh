#!/bin/bash
# Script to create products from the JSON file
# Usage: ./create-products-from-json.sh

API_URL="${API_URL:-http://localhost:4444}"
TOKEN="${TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "❌ Please set TOKEN environment variable (admin JWT token)"
  echo "   Usage: TOKEN=<your-token> ./create-products-from-json.sh"
  exit 1
fi

JSON_FILE="products_api_format.json"

if [ ! -f "$JSON_FILE" ]; then
  echo "❌ File $JSON_FILE not found"
  exit 1
fi

echo "📦 Creating products from $JSON_FILE..."
echo "🌐 API URL: $API_URL"

count=0
success=0
failed=0

# Read JSON array and create each product
for product in $(cat "$JSON_FILE" | jq -c '.'); do
  count=$((count + 1))
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/v1/products" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$product")
  
  http_code=$(echo "$response" | tail -n1)
  
  if [ "$http_code" = "201" ]; then
    success=$((success + 1))
    echo "✅ Product $count created"
  else
    failed=$((failed + 1))
    echo "❌ Product $count failed (HTTP $http_code)"
  fi
done

echo ""
echo "📊 Results: $success created, $failed failed out of $count products"