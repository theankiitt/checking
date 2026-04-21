"use client";

import { CategoryGrid } from "./CategoryGrid";

export default function CategoryShowcaseFirstRow() {
  return (
    <div className="bg-white py-16 w-full">
      <div className="w-full px-6">
        <CategoryGrid colorScheme="blue" />
      </div>
    </div>
  );
}
