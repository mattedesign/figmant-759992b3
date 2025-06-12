
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
      src="/lovable-uploads/b7882b31-a88e-4b28-9024-60c8a13a7c0a.png"
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};
