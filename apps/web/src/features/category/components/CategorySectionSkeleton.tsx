export default function CategorySectionSkeleton() {
  return (
    <div className="relative my-10 py-6 bg-white">
      <div className="mb-6 md:mb-8 mx-4 sm:mx-8 md:mx-12 lg:mx-20 mt-4">
        <div className="h-12 bg-gray-200 rounded-lg w-64 animate-pulse" />
      </div>

      <div className="relative mx-4 sm:mx-8 md:mx-16">
        <div className="flex space-x-4 sm:space-x-6 pb-4 ml-2 sm:ml-4 md:ml-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-64 h-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
