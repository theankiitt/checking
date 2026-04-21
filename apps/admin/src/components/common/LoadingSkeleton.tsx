"use client";

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded"></div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-3 px-3 py-3">
          <LoadingSkeleton className="w-5 h-5 rounded" />
          <LoadingSkeleton className="w-24 h-4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function UserTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4 px-4 py-3 border-b">
        <LoadingSkeleton className="w-4 h-4 rounded" />
        <LoadingSkeleton className="w-40 h-4 rounded" />
        <LoadingSkeleton className="w-24 h-4 rounded" />
        <LoadingSkeleton className="w-32 h-4 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 px-4 py-3">
          <LoadingSkeleton className="w-4 h-4 rounded" />
          <div className="flex items-center space-x-3 flex-1">
            <LoadingSkeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <LoadingSkeleton className="w-32 h-4 rounded" />
              <LoadingSkeleton className="w-48 h-3 rounded" />
            </div>
          </div>
          <LoadingSkeleton className="w-20 h-6 rounded-full" />
          <LoadingSkeleton className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <LoadingSkeleton className="w-12 h-12 rounded-lg mb-3" />
            <LoadingSkeleton className="w-20 h-8 rounded mb-2" />
            <LoadingSkeleton className="w-24 h-4 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <LoadingSkeleton className="w-64 h-6 rounded mb-4" />
          <div className="flex space-x-4">
            <LoadingSkeleton className="w-48 h-10 rounded" />
            <LoadingSkeleton className="w-32 h-10 rounded" />
          </div>
        </div>
        <UserTableSkeleton rows={6} />
      </div>
    </div>
  );
}
