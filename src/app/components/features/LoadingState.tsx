'use client';

import { Skeleton, SkeletonText } from '../ui/Skeleton';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="animate-reveal-up">
      {/* Loading message */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <Loader2 className="h-5 w-5 text-accent animate-spin" />
        <p className="text-fg-muted font-medium">
          Analyzing article content...
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main card skeleton */}
        <div className="md:col-span-2 bg-surface border border-border/50 rounded-2xl p-8 space-y-6">
          {/* Overline */}
          <Skeleton className="h-3 w-24" />

          {/* Title */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>

          {/* Meta */}
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Badges */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <SkeletonText lines={4} />
          </div>
        </div>

        {/* Stats panel skeleton */}
        <div className="bg-surface border border-border/50 rounded-2xl p-6 space-y-6">
          {/* Ring placeholder */}
          <div className="flex flex-col items-center">
            <Skeleton className="h-3 w-28 mb-4" />
            <Skeleton variant="circular" className="h-32 w-32" />
            <Skeleton className="h-4 w-36 mt-4" />
          </div>

          <div className="h-px bg-border" />

          {/* Categories placeholder */}
          <div>
            <Skeleton className="h-3 w-24 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-lg" />
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Spectrum placeholder */}
          <div>
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-4 w-24 mt-3 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
