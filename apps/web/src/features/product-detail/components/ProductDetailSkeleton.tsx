export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column - Images */}
        <div className="lg:col-span-5">
          {/* Thumbnails */}
          <div className="flex gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Middle Column - Product Info */}
        <div className="lg:col-span-4 space-y-4">
          {/* Brand */}
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          {/* Title */}
          <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
          {/* Rating */}
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          {/* Price */}
          <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
          {/* Attributes */}
          <div className="space-y-2 pt-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-full bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
          {/* Color */}
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          {/* Quantity */}
          <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 flex-1 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Right Column - Delivery */}
        <div className="lg:col-span-3 space-y-4">
          <div className="border border-gray-200 p-6 rounded-xl">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-full bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-full bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
