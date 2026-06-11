import React from 'react';

const SkeletonCard = () => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/5 animate-pulse">
    <div className="h-3 w-1/2 bg-white/10 rounded mb-4" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-md bg-white/10" />
      ))}
    </div>
    <div className="h-3 w-1/3 bg-white/10 rounded mt-4 ml-auto" />
  </div>
);

const PlayerSkeleton = () => (
  <div className="p-6 rounded-2xl border border-white/10 bg-white/5 animate-pulse">
    <div className="h-3 w-1/3 bg-white/10 rounded mb-4" />
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 shrink-0 rounded-md bg-white/10" />
      <div className="flex-grow space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Greeting */}
    <div className="space-y-2 animate-pulse">
      <div className="h-8 w-48 bg-white/10 rounded" />
      <div className="h-4 w-64 bg-white/10 rounded" />
    </div>

    {/* 4-column snippet grid — mirrors Home layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <PlayerSkeleton />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>

    {/* Podcasts row */}
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 animate-pulse">
      <div className="h-3 w-1/4 bg-white/10 rounded mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square rounded-md bg-white/10 mb-2" />
            <div className="h-3 bg-white/10 rounded w-3/4 mb-1" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
