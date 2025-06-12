
import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-16 w-16'
  };

  const handleImageError = () => {
    console.error('Logo image failed to load');
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Logo image loaded successfully');
    setImageLoading(false);
  };

  // Fallback SVG logo
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} ${className} bg-primary rounded-lg flex items-center justify-center`}>
      <span className="text-primary-foreground font-bold text-xs">
        {size === 'sm' ? 'F' : size === 'md' ? 'FIG' : 'FIGMANT'}
      </span>
    </div>
  );

  // Loading placeholder
  if (imageLoading && !imageError) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg`} />
    );
  }

  // Show fallback if image failed to load
  if (imageError) {
    return <FallbackLogo />;
  }

  return (
    <img
      src="/lovable-uploads/b7882b31-a88e-4b28-9024-60c8a13a7c0a.png"
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={handleImageError}
      onLoad={handleImageLoad}
      style={{ display: imageLoading ? 'none' : 'block' }}
    />
  );
};
