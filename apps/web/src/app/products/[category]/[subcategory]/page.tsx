import SubcategoryServer from "./SubcategoryServer";

export default async function SubcategoryPage({ params }: { params: Promise<{ category: string; subcategory: string }> }) {
  const { category, subcategory } = await params;
  
  return <SubcategoryServer categorySlug={category} subcategorySlug={subcategory} />;
}
