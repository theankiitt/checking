"use client";

import { categoryData } from "../types";
import CategorySectionItem from "./CategorySectionItem";

interface CategoryGridProps {
  colorScheme?: "orange" | "blue";
}

export default function CategoryGrid({
  colorScheme = "orange",
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {categoryData.map((section, index) => (
        <CategorySectionItem
          key={index}
          section={section}
          colorScheme={colorScheme}
        />
      ))}
    </div>
  );
}
