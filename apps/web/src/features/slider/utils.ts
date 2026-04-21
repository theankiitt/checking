export function normalizeImageUrl(
  imageUrl: string,
  baseUrl: string,
): string {
  if (!imageUrl) return imageUrl;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${normalizedPath}`;
}