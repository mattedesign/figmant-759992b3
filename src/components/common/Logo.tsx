
import React, { useState, useEffect } from 'react';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const { logoConfig, isLoading } = usePublicLogoConfig();

  // Optimized size classes for horizontal logo
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[150px]', 
    lg: 'h-14 w-auto max-w-[200px]'
  };

  useEffect(() => {
    if (isLoading) return;
    
    const loadImage = async () => {
      console.log('Loading logo with config:', logoConfig);
      setImageStatus('loading');
      
      // Try active logo first
      if (logoConfig.activeLogoUrl) {
        try {
          console.log('Attempting to load active logo:', logoConfig.activeLogoUrl);
          await testImageLoad(logoConfig.activeLogoUrl);
          setCurrentImageUrl(logoConfig.activeLogoUrl);
          setImageStatus('loaded');
          console.log('Active logo loaded successfully');
          return;
        } catch (error) {
          console.warn('Active logo failed to load:', error);
        }
      }

      // Try fallback logo
      if (logoConfig.fallbackLogoUrl && logoConfig.fallbackLogoUrl !== logoConfig.activeLogoUrl) {
        try {
          console.log('Attempting to load fallback logo:', logoConfig.fallbackLogoUrl);
          await testImageLoad(logoConfig.fallbackLogoUrl);
          setCurrentImageUrl(logoConfig.fallbackLogoUrl);
          setImageStatus('loaded');
          console.log('Fallback logo loaded successfully');
          return;
        } catch (error) {
          console.warn('Fallback logo failed to load:', error);
        }
      }

      // Both failed, show error state
      console.error('Both active and fallback logos failed to load, using FIGMANT fallback');
      setImageStatus('error');
    };

    loadImage();
  }, [logoConfig, isLoading]);

  const testImageLoad = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.error('Image load timeout for:', url);
        reject(new Error('Image load timeout'));
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        console.log('Image loaded successfully:', url);
        resolve();
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        console.error('Image load failed for:', url, error);
        reject(new Error('Image load failed'));
      };
      
      // Set crossOrigin for Supabase storage URLs
      if (url.includes('supabase')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.src = url;
    });
  };

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

  // Loading placeholder
  if (isLoading || imageStatus === 'loading') {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Show enhanced fallback if image failed to load
  if (imageStatus === 'error') {
    console.log('Showing FIGMANT fallback logo due to load errors');
    return <FallbackLogo />;
  }

  // Display the actual logo
  return (
    <img
      src={currentImageUrl}
      alt="Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={(e) => {
        console.error('Image onError triggered for:', currentImageUrl);
        setImageStatus('error');
      }}
      onLoad={() => {
        console.log('Image onLoad triggered successfully');
      }}
    />
  );
};
