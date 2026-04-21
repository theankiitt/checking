import { manrope } from "@/app/fonts";

interface EmptyStateProps {
  message?: string;
  title?: string;
}

export default function EmptyState({
  message = "No data found at the moment. Please check back later.",
  title = "Shop By Category",
}: EmptyStateProps) {
  return (
    <div className={`relative my-10 py-6 bg-white ${manrope.className}`} role="region">
      <div className="mb-6 md:mb-8 mx-4 sm:mx-8 md:mx-12 lg:mx-20 mt-4">
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0`}>
          <h2 >
            <span className={`text-xl sm:text-4xl text-black ${manrope.className} font-semibold`}>
              {title}
            </span>
          </h2>
        </div>
      </div>
      <div className="text-center text-2xl py-12 text-gray-800">{message}</div>
    </div>
  );
}
