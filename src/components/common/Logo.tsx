
import React, { useState, useEffect } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  // Optimized size classes for horizontal logo
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[150px]', 
    lg: 'h-14 w-auto max-w-[200px]'
  };

  useEffect(() => {
    const img = new Image();
    const timeoutId = setTimeout(() => {
      console.warn('Logo image load timeout - using fallback');
      setImageStatus('error');
    }, 3000); // Reduced timeout for better UX

    img.onload = () => {
      console.log('Figmant logo loaded successfully');
      clearTimeout(timeoutId);
      setImageStatus('loaded');
    };

    img.onerror = () => {
      console.error('Figmant logo failed to load - using fallback');
      clearTimeout(timeoutId);
      setImageStatus('error');
    };

    // Use the correct uploaded image path
    img.src = '/lovable-uploads/a885ff5a-2fbe-4cee-b4a7-62b7bc48ba93.png';

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Enhanced fallback with FIGMANT branding and colored dots
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 rounded-lg px-3 py-1`}>
      <div className="flex items-center space-x-1">
        <span className="text-primary-foreground font-bold text-sm tracking-wide">
          FIGMANT
        </span>
        <div className="flex space-x-1 ml-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  // Simplified loading placeholder
  if (imageStatus === 'loading') {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg`} />
    );
  }

  // Show enhanced fallback if image failed to load
  if (imageStatus === 'error') {
    return <FallbackLogo />;
  }

  // Display the actual Figmant logo
  return (
    <img
      src="/lovable-uploads/a885ff5a-2fbe-4cee-b4a7-62b7bc48ba93.png"
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
    />
  );
};
