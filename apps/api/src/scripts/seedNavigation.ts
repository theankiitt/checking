import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const navigationData = [
  {
    id: "foods",
    label: "FOODS",
    href: "/products/foods",
    type: "dropdown",
    columns: [
      {
        title: "ACHAR (Pickle)",
        groups: [
          {
            title: "VEG ACHAR",
            items: [
              {
                label: "Mix Achar",
                href: "/products/foods/achar/veg/mix-achar",
              },
              {
                label: "Radish Achar",
                href: "/products/foods/achar/veg/radish-achar",
              },
              {
                label: "Mushroom Achar",
                href: "/products/foods/achar/veg/mushroom-achar",
              },
              {
                label: "Gundruk Achar",
                href: "/products/foods/achar/veg/gundruk-achar",
              },
              {
                label: "Tomato Achar",
                href: "/products/foods/achar/veg/tomato-achar",
              },
              {
                label: "Green Mango Achar",
                href: "/products/foods/achar/veg/green-mango-achar",
              },
              {
                label: "Carrot Achar",
                href: "/products/foods/achar/veg/carrot-achar",
              },
              {
                label: "Cabbage Achar",
                href: "/products/foods/achar/veg/cabbage-achar",
              },
              {
                label: "Cucumber Achar",
                href: "/products/foods/achar/veg/cucumber-achar",
              },
              {
                label: "Turnip Achar",
                href: "/products/foods/achar/veg/turnip-achar",
              },
            ],
          },
          {
            title: "NON VEG ACHAR",
            items: [
              {
                label: "Buff Achar",
                href: "/products/foods/achar/non-veg/buff-achar",
              },
              {
                label: "Chicken Achar",
                href: "/products/foods/achar/non-veg/chicken-achar",
              },
              {
                label: "Pork Achar",
                href: "/products/foods/achar/non-veg/pork-achar",
              },
              {
                label: "Mutton Achar",
                href: "/products/foods/achar/non-veg/mutton-achar",
              },
              {
                label: "Fish Achar",
                href: "/products/foods/achar/non-veg/fish-achar",
              },
              {
                label: "Shrimp Achar",
                href: "/products/foods/achar/non-veg/shrimp-achar",
              },
              {
                label: "Duck Achar",
                href: "/products/foods/achar/non-veg/duck-achar",
              },
              {
                label: "Egg Achar",
                href: "/products/foods/achar/non-veg/egg-achar",
              },
            ],
          },
        ],
      },
      {
        title: "TEA",
        items: [
          {
            label: "Green Tea (Tea Bag)",
            href: "/products/foods/tea/green-tea-(tea-bag)",
          },
          {
            label: "CTC Masala Tea",
            href: "/products/foods/tea/ctc-masala-tea",
          },
          { label: "Golden Needle", href: "/products/foods/tea/golden-needle" },
          { label: "Silver Needle", href: "/products/foods/tea/silver-needle" },
          { label: "Oolong Tea", href: "/products/foods/tea/oolong-tea" },
          { label: "Black Tea", href: "/products/foods/tea/black-tea" },
          { label: "Herbal Tea", href: "/products/foods/tea/herbal-tea" },
        ],
      },
      {
        title: "TYPICAL NEPALI",
        items: [
          { label: "Pustakari", href: "/products/foods/nepali/pustakari" },
          { label: "Gudpak", href: "/products/foods/nepali/gudpak" },
          { label: "Honey", href: "/products/foods/nepali/honey" },
          { label: "Buff Sukuti", href: "/products/foods/nepali/buff-sukuti" },
          {
            label: "Sukuti (Dry meat)",
            href: "/products/foods/nepali/sukuti-(dry-meat)",
          },
          {
            label: "Asala Dry Fish",
            href: "/products/foods/nepali/asala-dry-fish",
          },
          { label: "Dry Sidra", href: "/products/foods/nepali/dry-sidra" },
          { label: "Ghee", href: "/products/foods/nepali/ghee" },
          { label: "Chhurpi", href: "/products/foods/nepali/chhurpi" },
          { label: "Kagati", href: "/products/foods/nepali/kagati" },
        ],
      },
      {
        title: "SPICE (MASALA)",
        items: [
          { label: "Momo Masala", href: "/products/foods/spice/momo" },
          {
            label: "Thukpa Masala",
            href: "/products/foods/spice/thukpa-masala",
          },
          { label: "Chatpate Masala", href: "/products/foods/spice/chatpate" },
          {
            label: "Meat Curry Masala",
            href: "/products/foods/spice/meat-curry",
          },
          {
            label: "Dal Makhani Masala",
            href: "/products/foods/spice/dal-makhani",
          },
          {
            label: "Pani Puri Masala",
            href: "/products/foods/spice/pani-puri",
          },
          {
            label: "Chicken Masala",
            href: "/products/foods/spice/chicken-masala",
          },
          { label: "Garam Masala", href: "/products/foods/spice/garam-masala" },
          {
            label: "Turmeric Powder",
            href: "/products/foods/spice/turmeric-powder",
          },
          {
            label: "Coriander Powder",
            href: "/products/foods/spice/coriander-powder",
          },
          { label: "Cumin Powder", href: "/products/foods/spice/cumin-powder" },
          { label: "Chili Powder", href: "/products/foods/spice/chili-powder" },
        ],
      },
    ],
  },
  {
    id: "gift-souvenir",
    label: "GIFT and SOUVENIR",
    href: "/products/gift-souvenir",
    type: "link",
  },
  {
    id: "puja-samagri",
    label: "PUJA SAMAGRI",
    href: "/products/puja-samagri",
    type: "link",
  },
  {
    id: "handicrafts",
    label: "HANDICRAFTS",
    href: "/products/handicrafts",
    type: "link",
  },
  {
    id: "dress",
    label: "DRESS",
    href: "/products/dress",
    type: "dropdown",
    columns: [
      {
        title: "WOMEN",
        items: [
          { label: "Lehanga", href: "/products/dress/women/lehanga" },
          { label: "Saree", href: "/products/dress/women/saree" },
          { label: "Gown", href: "/products/dress/women/gown" },
          { label: "Kurtha", href: "/products/dress/women/kurtha" },
          { label: "Newari", href: "/products/dress/women/newari" },
          { label: "Gurung/Magar", href: "/products/dress/women/gurung-magar" },
          { label: "Tamang", href: "/products/dress/women/tamang" },
          { label: "Rai/Limbu", href: "/products/dress/women/rai-limbu" },
          { label: "Bridal Set", href: "/products/dress/women/bridal-set" },
          { label: "Choli", href: "/products/dress/women/choli" },
        ],
      },
      {
        title: "MEN",
        items: [
          { label: "Daura Surwal", href: "/products/dress/men/daura-surwal" },
          {
            label: "Suit Set (2pcs/3pcs)",
            href: "/products/dress/men/suit-set",
          },
          { label: "Kurtha", href: "/products/dress/men/kurtha" },
          { label: "Newari", href: "/products/dress/men/newari" },
          { label: "Gurung/Magar", href: "/products/dress/men/gurung-magar" },
          { label: "Tamang", href: "/products/dress/men/tamang" },
          { label: "Rai/Limbu", href: "/products/dress/men/rai-limbu" },
          {
            label: "Bridal Set (Groom)",
            href: "/products/dress/men/bridal-set",
          },
        ],
      },
      {
        title: "KIDS",
        items: [
          { label: "Girls Dress", href: "/products/dress/kids/girls" },
          { label: "Boys Dress", href: "/products/dress/kids/boys" },
        ],
      },
    ],
  },
  {
    id: "musical-instruments",
    label: "MUSICAL INSTRUMENTS",
    href: "/products/musical-instruments",
    type: "link",
  },
  {
    id: "herbs-naturals",
    label: "HERBS & NATURALS",
    href: "/products/herbs-naturals",
    type: "link",
  },
  {
    id: "books",
    label: "BOOKS",
    href: "/products/books",
    type: "link",
  },
];

async function main() {

  await prisma.systemConfig.upsert({
    where: { key: "navigation_menu" },
    update: { value: navigationData },
    create: {
      key: "navigation_menu",
      value: navigationData,
    },
  });

}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
