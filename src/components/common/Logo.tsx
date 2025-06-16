
import React, { useState, useEffect } from 'react';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('/lovable-uploads/dbcf2493-ebb3-44e5-a137-ca8d4ae7511f.png');
  const { logoConfig, isLoading } = usePublicLogoConfig();

  // Optimized size classes for the logo
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[150px]', 
    lg: 'h-16 w-auto max-w-[200px]'
  };

  useEffect(() => {
    const loadImage = async () => {
      console.log('=== LOGO COMPONENT: LOADING NEW LOGO ===');
      
      setImageStatus('loading');
      
      // Use the new uploaded logo
      const logoToTest = '/lovable-uploads/dbcf2493-ebb3-44e5-a137-ca8d4ae7511f.png';
      
      console.log('Logo component: Testing new logo URL:', logoToTest);
      
      try {
        const isAccessible = await testImageLoad(logoToTest);
        
        if (isAccessible) {
          setCurrentImageUrl(logoToTest);
          setImageStatus('loaded');
          console.log('✓ Logo component: Successfully loaded new logo:', logoToTest);
        } else {
          console.warn('✗ Logo component: Failed to load new logo, trying fallback');
          setImageStatus('error');
        }
      } catch (error) {
        console.error('Logo component: Error during image loading:', error);
        setImageStatus('error');
      }
    };

    loadImage();
  }, []);

  const testImageLoad = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('Logo component: Testing image load for:', url);
      
      // For local assets, assume they're accessible
      if (url.startsWith('/lovable-uploads/') || url.startsWith('/')) {
        console.log('Logo component: Local asset detected, assuming accessible');
        resolve(true);
        return;
      }
      
      const img = new Image();
      const timeout = setTimeout(() => {
        console.error('Logo component: Image load timeout for:', url);
        resolve(false);
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        console.log('✓ Logo component: Image loaded successfully:', url);
        resolve(true);
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        console.error('✗ Logo component: Image load failed for:', url, error);
        resolve(false);
      };
      
      img.src = url;
    });
  };

  // Fallback component with the Figmant branding
  const FallbackLogo = () => (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-3 py-1`}>
      <div className="flex items-center space-x-1">
        <span className="text-white font-bold text-sm tracking-wide">
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
  if (imageStatus === 'loading') {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Show fallback if image failed to load
  if (imageStatus === 'error') {
    console.log('Logo component: Showing Figmant fallback due to load errors');
    return <FallbackLogo />;
  }

  // Display the actual logo
  return (
    <img
      src={currentImageUrl}
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={(e) => {
        console.error('Logo component: Image onError triggered for:', currentImageUrl);
        setImageStatus('error');
      }}
      onLoad={() => {
        console.log('✓ Logo component: Image onLoad triggered successfully for:', currentImageUrl);
      }}
    />
  );
};
