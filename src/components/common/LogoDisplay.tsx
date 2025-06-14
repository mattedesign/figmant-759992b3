
import React from 'react';
import { EnhancedLogo } from './EnhancedLogo';
import { LogoType } from '@/types/logo';

interface LogoDisplayProps {
  context: 'navigation' | 'auth' | 'header' | 'sidebar';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LogoDisplay: React.FC<LogoDisplayProps> = ({ context, size, className }) => {
  const getLogoTypeAndSize = (): { type: LogoType; defaultSize: 'sm' | 'md' | 'lg' } => {
    switch (context) {
      case 'navigation':
      case 'sidebar':
        return { type: 'icon', defaultSize: 'sm' };
      case 'auth':
        return { type: 'brand', defaultSize: 'lg' };
      case 'header':
        return { type: 'brand', defaultSize: 'md' };
      default:
        return { type: 'brand', defaultSize: 'md' };
    }
  };

  const { type, defaultSize } = getLogoTypeAndSize();
  const finalSize = size || defaultSize;

  return (
    <EnhancedLogo
      type={type}
      size={finalSize}
      className={className}
    />
  );
};
