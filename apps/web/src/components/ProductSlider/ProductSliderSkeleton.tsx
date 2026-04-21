export default function ProductSliderSkeleton() {
  return (
    <div className="w-full space-y-12 md:space-y-16 px-4 md:px-8 lg:px-16">
      {[...Array(3)].map((_, sectionIndex) => (
        <section key={sectionIndex} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-3 md:p-4">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
