
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const EnhancedDashboardSkeleton: React.FC = () => (
  <div className="h-full overflow-y-auto">
    <div className="container mx-auto px-6 py-6 space-y-8">
      {/* Enhanced Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Analysis Skeleton */}
          <div className="border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Insights Section Skeleton */}
          <div className="border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center py-3 px-4 hover:bg-gray-50 rounded-lg">
                  <Skeleton className="w-8 h-8 rounded-full mr-3" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar Skeleton */}
        <div className="space-y-8">
          {/* My Prompts Skeleton */}
          <div className="border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <Skeleton className="w-6 h-6 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notes Skeleton */}
          <div className="border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-1">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-3 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const QuickAnalysisSkeleton: React.FC = () => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="border rounded-xl p-4 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-4 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-8 bg-gray-200 rounded" />
          </div>
          <div className="h-2 w-full bg-gray-200 rounded" />
        </div>
      </div>
    ))}
  </div>
);
