
import React, { useState, useEffect } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const sizeClasses = {
    sm: 'h-6 w-20',
    md: 'h-8 w-24', 
    lg: 'h-12 w-32'
  };

  useEffect(() => {
    const img = new Image();
    const timeoutId = setTimeout(() => {
      console.warn('Logo image load timeout - using fallback');
      setImageStatus('error');
    }, 5000); // 5 second timeout

    img.onload = () => {
      console.log('Logo image loaded successfully');
      clearTimeout(timeoutId);
      setImageStatus('loaded');
    };

    img.onerror = () => {
      console.error('Logo image failed to load');
      clearTimeout(timeoutId);
      setImageStatus('error');
    };

    img.src = '/lovable-uploads/b7882b31-a88e-4b28-9024-60c8a13a7c0a.png';

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Fallback SVG logo
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} ${className} bg-primary rounded-lg flex items-center justify-center`}>
      <span className="text-primary-foreground font-bold text-xs">
        {size === 'sm' ? 'F' : size === 'md' ? 'FIG' : 'FIGMANT'}
      </span>
    </div>
  );

  // Loading placeholder
  if (imageStatus === 'loading') {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg`} />
    );
  }

  // Show fallback if image failed to load or timed out
  if (imageStatus === 'error') {
    return <FallbackLogo />;
  }

  return (
    <img
      src="/lovable-uploads/b7882b31-a88e-4b28-9024-60c8a13a7c0a.png"
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
    />
  );
};
