
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <img
      src="/lovable-uploads/febe6e50-cb1d-4a98-bfb3-71e8fa652802.png"
      alt="Logo"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};
