
import React from 'react';

interface AnalysisImageProps {
  analysis: any;
  title: string;
}

export const AnalysisImage: React.FC<AnalysisImageProps> = ({ analysis, title }) => {
  const getAnalysisImage = (analysis: any) => {
    // For design analyses, try to get the uploaded design image
    if (analysis.type === 'design' && analysis.imageUrl) {
      return analysis.imageUrl;
    }
    
    // For chat analyses, you might want to use a screenshot or uploaded image
    if (analysis.type === 'chat' && analysis.imageUrl) {
      return analysis.imageUrl;
    }
    
    // Default placeholder image
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop';
  };

  return (
    <div className="w-12 h-9 rounded overflow-hidden flex-shrink-0 bg-gray-100">
      <img 
        src={getAnalysisImage(analysis)}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to a placeholder if image fails to load
          e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop';
        }}
      />
    </div>
  );
};
