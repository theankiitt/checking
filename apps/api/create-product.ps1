# ============================================
# GharSamma API - Create Product via Curl (PowerShell)
# ============================================

$API_URL = "http://localhost:3001/api/v1"

# Step 1: Login as Admin to get JWT token
Write-Host "`n🔐 Step 1: Logging in as admin..." -ForegroundColor Cyan

$loginBody = @{
    email = "admin@gharsamma.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/admin/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $token = $loginResponse.token
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host "`nToken: $($token.Substring(0, [Math]::Min(20, $token.Length)))..."
Write-Host ""

# Step 2: Create Product
Write-Host "📦 Step 2: Creating product..." -ForegroundColor Cyan

$productBody = @{
    name = "Handwoven Nepali Carpet - Traditional Design"
    description = "<p>Authentic handwoven carpet made by skilled Nepali artisans using traditional techniques.</p>"
    shortDescription = "Authentic handwoven Nepali carpet with traditional patterns"
    price = 299.99
    comparePrice = 499.99
    categoryId = "REPLACE_WITH_CATEGORY_ID"
    sku = "CARPET-NEP-001"
    barcode = "1234567890123"
    quantity = 50
    trackQuantity = $true
    lowStockThreshold = 10
    allowBackorder = $false
    manageStock = $true
    weight = 5.5
    weightUnit = "kg"
    dimensions = @{
        length = 180
        width = 120
        height = 2
        unit = "cm"
    }
    images = @(
        "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800",
        "https://images.unsplash.com/photo-1564078516393-cf04bd96b897?w=800"
    )
    thumbnail = "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400"
    videos = @(
        "https://www.youtube.com/watch?v=example1"
    )
    isActive = $true
    isFeatured = $true
    isNew = $true
    isBestSeller = $false
    isOnSale = $true
    isDigital = $false
    visibility = "VISIBLE"
    seoTitle = "Handwoven Nepali Carpet - Traditional Design | GharSamma"
    seoDescription = "Buy authentic handwoven Nepali carpets with traditional patterns."
    seoKeywords = @("nepali carpet", "handwoven", "traditional", "wool")
    metaTags = @{
        material = "wool"
        origin = "Nepal"
        craft = "handwoven"
    }
    requiresShipping = $true
    shippingClass = "standard"
    freeShipping = $false
    taxable = $true
    tags = @("carpet", "handwoven", "nepali", "traditional")
    currencyPrices = @(
        @{
            country = "USA"
            currency = "USD"
            symbol = "$"
            price = 299.99
            comparePrice = 499.99
            minDeliveryDays = 7
            maxDeliveryDays = 14
            isActive = $true
        },
        @{
            country = "Nepal"
            currency = "NPR"
            symbol = "Rs"
            price = 39999
            comparePrice = 59999
            minDeliveryDays = 2
            maxDeliveryDays = 5
            isActive = $true
        },
        @{
            country = "India"
            currency = "INR"
            symbol = "₹"
            price = 24999
            comparePrice = 39999
            minDeliveryDays = 3
            maxDeliveryDays = 7
            isActive = $true
        }
    )
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $productResponse = Invoke-RestMethod -Uri "$API_URL/products" -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($productBody))
    Write-Host "`n✅ Product created successfully!" -ForegroundColor Green
    Write-Host "🆔 Product ID: $($productResponse.data.product.id)" -ForegroundColor Yellow
    Write-Host "📛 Product Name: $($productResponse.data.product.name)" -ForegroundColor Yellow
} catch {
    Write-Host "`n❌ Product creation failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
