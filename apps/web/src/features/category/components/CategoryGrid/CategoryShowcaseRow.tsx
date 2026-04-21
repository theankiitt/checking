"use client";

import { categoryData, CategorySection } from "../types";
import CategorySectionItem from "./CategorySectionItem";

interface CategoryShowcaseRowProps {
  colorScheme?: "orange" | "blue";
  sections?: CategorySection[];
}

export default function CategoryShowcaseRow({
  colorScheme = "orange",
  sections = categoryData,
}: CategoryShowcaseRowProps) {
  return (
    <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
      {sections.map((section, index) => (
        <CategorySectionItem
          key={index}
          section={section}
          colorScheme={colorScheme}
        />
      ))}
    </div>
  );
}
