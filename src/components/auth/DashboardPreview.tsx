
import React from 'react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDribbbleShots } from '@/hooks/useDribbbleShots';
import { Loader2, ExternalLink } from 'lucide-react';

export const DashboardPreview = () => {
  const { data: uploads, isLoading: uploadsLoading } = useDesignUploads();
  
  // Only fetch Dribbble shots if we have no uploads or very few uploads
  const hasEnoughUploads = uploads && uploads.length >= 8;
  const { shots: dribbbleShots, isLoading: dribbbleLoading } = useDribbbleShots(!hasEnoughUploads);

  // Determine what content to show
  const getDisplayContent = () => {
    if (hasEnoughUploads) {
      return uploads.slice(0, 12);
    }
    
    // Combine uploads with Dribbble shots if we have some uploads but not enough
    const combinedContent = [
      ...(uploads || []),
      ...dribbbleShots.slice(0, 12 - (uploads?.length || 0))
    ];
    
    return combinedContent.slice(0, 12);
  };

  const displayContent = getDisplayContent();
  const isLoading = uploadsLoading || (!hasEnoughUploads && dribbbleLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderUploadItem = (upload: any, index: number) => (
    <div
      key={`upload-${upload.id || index}`}
      className="aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      {upload.file_path ? (
        <img
          src={upload.file_path}
          alt={upload.file_name || `Design ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-gray-600">Design Upload</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderDribbbleItem = (shot: any, index: number) => (
    <div
      key={`dribbble-${shot.id || index}`}
      className="aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative"
    >
      <img
        src={shot.images?.teaser || shot.images?.normal}
        alt={shot.title || `Design inspiration ${index + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-end">
        <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{shot.title}</p>
              <p className="text-xs opacity-75 truncate">by {shot.user?.name}</p>
            </div>
            <ExternalLink className="h-3 w-3 ml-2 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFallbackItem = (index: number) => (
    <div
      key={`fallback-${index}`}
      className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
        <p className="text-xs text-gray-600">Sample Design</p>
      </div>
    </div>
  );

  // Helper function to check if an item is a DesignUpload
  const isDesignUpload = (item: any): boolean => {
    return 'file_path' in item && 'file_name' in item;
  };

  // Helper function to check if an item is a DribbbleShot
  const isDribbbleShot = (item: any): boolean => {
    return 'images' in item && 'title' in item && 'user' in item;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {hasEnoughUploads ? 'Recent Design Uploads' : 'Design Inspiration'}
        </h2>
        <p className="text-sm text-gray-600">
          {hasEnoughUploads 
            ? 'See what our users have been analyzing lately'
            : 'Popular designs from the community and recent uploads'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
        {displayContent.length > 0 ? (
          displayContent.map((item, index) => {
            // Use type guards to determine which renderer to use
            if (isDesignUpload(item)) {
              return renderUploadItem(item, index);
            } else if (isDribbbleShot(item)) {
              return renderDribbbleItem(item, index);
            } else {
              return renderFallbackItem(index);
            }
          })
        ) : (
          // Fallback when no content is available
          Array.from({ length: 12 }).map((_, index) => renderFallbackItem(index))
        )}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          {hasEnoughUploads 
            ? 'Join thousands of designers getting AI-powered insights'
            : 'Get inspired by top designs and start analyzing your own'
          }
        </p>
      </div>
    </div>
  );
};
