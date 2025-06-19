
import React, { useState } from 'react';
import { FileImage, Link, MessageSquare, BarChart3, Image } from 'lucide-react';

interface AnalysisImageProps {
  analysis: any;
  title: string;
}

export const AnalysisImage: React.FC<AnalysisImageProps> = ({ analysis, title }) => {
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);

  const getAnalysisImage = (analysis: any) => {
    // For design analyses, try to get the uploaded design image
    if (analysis.type === 'design' && analysis.imageUrl) {
      return analysis.imageUrl;
    }
    
    // For chat analyses, check for screenshots or uploaded images
    if (analysis.type === 'chat') {
      // Check for uploaded image URLs from analysis results
      if (analysis.analysis_results?.upload_ids?.length > 0) {
        // Could potentially fetch screenshot or image preview here
        // For now, we'll use a placeholder but show that there are attachments
        return null; // Will show attachment icon instead
      }
      
      if (analysis.imageUrl) {
        return analysis.imageUrl;
      }
    }
    
    return null;
  };

  const getPreviewIcon = () => {
    if (analysis.type === 'chat') {
      // Check if there are URL attachments
      if (analysis.analysis_results?.upload_ids?.length > 0) {
        return Link;
      }
      return MessageSquare;
    }
    
    if (analysis.type === 'design') {
      return BarChart3;
    }
    
    return FileImage;
  };

  const imageUrl = getAnalysisImage(analysis);
  const PreviewIcon = getPreviewIcon();

  // Show attachment count overlay for chat analyses with attachments
  const hasAttachments = analysis.type === 'chat' && analysis.analysis_results?.upload_ids?.length > 0;
  const attachmentCount = hasAttachments ? analysis.analysis_results.upload_ids.length : 0;

  if (imageUrl && !imageLoadError) {
    return (
      <div className="w-12 h-9 rounded overflow-hidden flex-shrink-0 bg-gray-100 relative">
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => {
            setImageLoadError('Failed to load image');
          }}
        />
        {hasAttachments && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {attachmentCount}
          </div>
        )}
      </div>
    );
  }

  // Fallback to icon-based preview
  return (
    <div className="w-12 h-9 rounded overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center relative">
      <PreviewIcon className="w-5 h-5 text-gray-400" />
      {hasAttachments && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {attachmentCount}
        </div>
      )}
    </div>
  );
};
