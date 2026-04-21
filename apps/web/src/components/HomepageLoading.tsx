export default function HomepageLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="w-[100vw] md:w-[95vw] mx-auto px-4 md:px-12 mt-6">
        <div className="h-48 sm:h-64 md:h-80 lg:h-[700px] bg-gray-200 rounded-lg" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>

        <div className="h-96 bg-gray-200 rounded-lg mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
