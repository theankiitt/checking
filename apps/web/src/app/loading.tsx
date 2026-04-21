export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Skeleton loader for homepage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Slider Skeleton */}
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] bg-gray-200 rounded-xl overflow-hidden mb-8 animate-pulse" />

        {/* Product Categories Skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid Skeletons */}
        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 5 }).map((_, productIndex) => (
                <div
                  key={productIndex}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* Product Image Skeleton */}
                  <div className="relative aspect-square bg-gray-200 animate-pulse" />
                  
                  {/* Product Info Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
