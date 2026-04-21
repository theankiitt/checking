const API_BASE_URL = "http://localhost:4444/api/v1";

const products = [
  // FOODS
  {
    name: "Traditional Sel Roti",
    description:
      "Authentic Nepali rice bread, crispy on outside and soft inside",
    shortDescription: "Crispy traditional Nepali rice bread",
    price: 150,
    comparePrice: 200,
    sku: "FOOD-SEL-001",
    quantity: 50,
    category: "Foods",
    isActive: true,
    isNew: true,
  },
  {
    name: "Fresh Yomari",
    description:
      "Traditional Newari rice cake filled with molasses and coconut",
    shortDescription: "Traditional Newari sweet dumpling",
    price: 80,
    comparePrice: 100,
    sku: "FOOD-YOM-001",
    quantity: 30,
    category: "Foods",
    isActive: true,
  },
  // DRESS
  {
    name: "Elegant Silk Sari",
    description:
      "Beautiful handwoven silk sari with traditional embroidery work",
    shortDescription: "Handwoven silk sari",
    price: 12500,
    comparePrice: 15000,
    sku: "DRESS-SAR-001",
    quantity: 15,
    category: "Dress",
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Designer Lehenga Choli",
    description: "Stunning designer lehenga for special occasions",
    shortDescription: "Designer lehenga with mirror work",
    price: 18500,
    comparePrice: 22000,
    sku: "DRESS-LEH-001",
    quantity: 8,
    category: "Dress",
    isActive: true,
    isFeatured: true,
  },
  // DIAMOND
  {
    name: "Diamond Gold Necklace",
    description: "Elegant 18K gold necklace with certified diamonds",
    shortDescription: "18K gold necklace with diamonds",
    price: 125000,
    comparePrice: 150000,
    sku: "JEW-DIA-NEK-001",
    quantity: 5,
    category: "Diamond",
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Diamond Stud Earrings",
    description: "Classic diamond stud earrings in white gold",
    shortDescription: "Diamond stud earrings",
    price: 45000,
    comparePrice: 55000,
    sku: "JEW-DIA-EAR-001",
    quantity: 10,
    category: "Diamond",
    isActive: true,
    isFeatured: true,
  },
  // CARPET
  {
    name: "Handwoven Wool Carpet",
    description: "Authentic Nepalese wool carpet with traditional design",
    shortDescription: "Handwoven wool carpet",
    price: 25000,
    comparePrice: 35000,
    sku: "CARPET-WOOL-001",
    quantity: 12,
    category: "Carpet",
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Silk Runner Carpet",
    description: "Luxurious pure silk runner carpet",
    shortDescription: "Pure silk runner carpet",
    price: 45000,
    comparePrice: 60000,
    sku: "CARPET-SILK-001",
    quantity: 6,
    category: "Carpet",
    isActive: true,
    isBestSeller: true,
  },
  // STATUES
  {
    name: "Lord Buddha Statue",
    description: "Hand-carved bronze Buddha statue",
    shortDescription: "Hand-carved bronze Buddha",
    price: 15000,
    comparePrice: 20000,
    sku: "STAT-BUD-001",
    quantity: 8,
    category: "Statues",
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Hindu God Ganesh Statue",
    description: "Traditional Ganesh idol with gold finish",
    shortDescription: "Ganesh statue",
    price: 3500,
    comparePrice: 5000,
    sku: "STAT-GAN-001",
    quantity: 20,
    category: "Statues",
    isActive: true,
    isBestSeller: true,
  },
];

async function createProducts() {
  // First, try to get auth token
  let token = null;

  try {
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "admin123",
      }),
    });

    if (loginRes.ok) {
      const loginData = await loginRes.json();
      token = loginData.token;
    }
  } catch (e) {
    console.log("Login failed, trying without auth...");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("Creating products...\n");

  for (const product of products) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`✓ Created: ${product.name} (${product.category})`);
      } else {
        console.log(`✗ Failed: ${product.name} - ${data.message || "Error"}`);
      }
    } catch (e) {
      console.log(`✗ Error creating ${product.name}:`, e.message);
    }
  }

  console.log("\nDone!");
}

createProducts();
