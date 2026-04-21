import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-amber-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
