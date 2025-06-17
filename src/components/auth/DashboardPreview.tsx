
import React from 'react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { Loader2 } from 'lucide-react';

export const DashboardPreview = () => {
  const { data: uploads, isLoading } = useDesignUploads();

  // Get recent screenshots (limit to 12 for the grid)
  const recentScreenshots = uploads?.slice(0, 12) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Design Uploads</h2>
        <p className="text-sm text-gray-600">
          See what our users have been analyzing lately
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
        {recentScreenshots.length > 0 ? (
          recentScreenshots.map((upload, index) => (
            <div
              key={upload.id || index}
              className="aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {upload.file_url ? (
                <img
                  src={upload.file_url}
                  alt={upload.filename || `Design ${index + 1}`}
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
          ))
        ) : (
          // Placeholder designs when no uploads exist
          Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                <p className="text-xs text-gray-600">Sample Design</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Join thousands of designers getting AI-powered insights
        </p>
      </div>
    </div>
  );
};
