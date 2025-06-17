
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const RecentAnalysisLoading: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const InsightsSectionLoading: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center py-3 px-4">
          <Skeleton className="w-8 h-8 rounded-full mr-3" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MyPromptsSectionLoading: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-16" />
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
);

export const NotesSectionLoading: React.FC = () => (
  <div className="space-y-4">
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
);

// Add InsightsLoading as an alias for backward compatibility
export const InsightsLoading = InsightsSectionLoading;
