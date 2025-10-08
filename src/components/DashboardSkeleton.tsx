import React from 'react';

/**
 * A skeleton loader component that mimics the layout of the main dashboard
 * content, providing a better user experience while data is fetching.
 */
const SkeletonCard = () => (
  <div className="bg-gray-700/50 p-4 rounded-lg">
    <div className="aspect-square bg-gray-600 rounded-md mb-4"></div>
    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
  </div>
);

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Skeleton for Playlists Section */}
      <div className="p-8 bg-gray-800 rounded-lg">
        <div className="h-8 w-1/3 bg-gray-700 rounded-md mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>

      {/* Skeleton for Tracks Section */}
      <div className="p-8 bg-gray-800 rounded-lg">
        <div className="h-8 w-1/3 bg-gray-700 rounded-md mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;