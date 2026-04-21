import CategoryServer from "./CategoryServer";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryServer categorySlug={category} />;
}
