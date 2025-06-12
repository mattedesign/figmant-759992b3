
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  // Optimized size classes for horizontal logo
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[150px]', 
    lg: 'h-14 w-auto max-w-[200px]'
  };

  return (
    <img
      src="/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png"
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
    />
  );
};
