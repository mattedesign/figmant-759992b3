
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface EnhancedLoadingStateProps {
  variant?: 'full' | 'table' | 'cards' | 'minimal';
  itemCount?: number;
}

export const EnhancedLoadingState: React.FC<EnhancedLoadingStateProps> = ({ 
  variant = 'full', 
  itemCount = 6 
}) => {
  const renderTableSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table headers */}
          <div className="grid grid-cols-7 gap-4 pb-2 border-b">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {/* Table rows */}
          {Array.from({ length: itemCount }).map((_, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCardsSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: itemCount }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex gap-2 mt-3">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderHeaderSkeleton = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );

  const renderFiltersSkeleton = () => (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-[140px] h-10" />
          <Skeleton className="w-[140px] h-10" />
        </div>
      </CardContent>
    </Card>
  );

  const renderMinimalSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );

  const renderFullSkeleton = () => (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {renderHeaderSkeleton()}
      {renderFiltersSkeleton()}
      {variant === 'table' ? renderTableSkeleton() : renderCardsSkeleton()}
    </div>
  );

  if (variant === 'minimal') {
    return renderMinimalSkeleton();
  }

  if (variant === 'table') {
    return (
      <div className="p-6 space-y-6">
        {renderHeaderSkeleton()}
        {renderFiltersSkeleton()}
        {renderTableSkeleton()}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className="p-6 space-y-6">
        {renderHeaderSkeleton()}
        {renderFiltersSkeleton()}
        {renderCardsSkeleton()}
      </div>
    );
  }

  return renderFullSkeleton();
};
