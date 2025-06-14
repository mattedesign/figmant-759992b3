
import React from 'react';
import { LogoDisplay } from './LogoDisplay';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  context?: 'navigation' | 'auth' | 'header' | 'sidebar';
}

export const Logo: React.FC<LogoProps> = ({ size, className, context = 'header' }) => {
  return (
    <LogoDisplay
      context={context}
      size={size}
      className={className}
    />
  );
};
