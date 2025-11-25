import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
};

export const PromptCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-soft bg-white h-96 w-full">
      <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-4 bg-slate-300/50 rounded w-1/3 animate-pulse" />
        <div className="h-6 bg-slate-300/50 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-300/50 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
};

export const PromptDetailSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-soft">
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-soft-lg h-[500px] bg-slate-200 animate-pulse" />
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="space-y-3 mt-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
