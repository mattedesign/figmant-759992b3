
import React, { useState, useEffect } from 'react';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';
import { DEFAULT_FALLBACK_LOGO } from '@/hooks/logo/types';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const { logoConfig, isLoading } = usePublicLogoConfig();

  // Optimized size classes for the logo
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[150px]', 
    lg: 'h-16 w-auto max-w-[200px]'
  };

  useEffect(() => {
    if (isLoading) return;
    
    const loadImage = async () => {
      console.log('Logo component: Loading image with config:', logoConfig);
      setImageStatus('loading');
      
      // Always try the default fallback first since it's a local asset
      const logoToTest = logoConfig.activeLogoUrl || DEFAULT_FALLBACK_LOGO;
      
      console.log('Logo component: Testing logo URL:', logoToTest);
      
      try {
        await testImageLoad(logoToTest);
        setCurrentImageUrl(logoToTest);
        setImageStatus('loaded');
        console.log('Logo component: Successfully loaded logo:', logoToTest);
      } catch (error) {
        console.error('Logo component: Failed to load logo:', logoToTest, error);
        
        // If the configured logo fails, try the default fallback
        if (logoToTest !== DEFAULT_FALLBACK_LOGO) {
          console.log('Logo component: Trying default fallback:', DEFAULT_FALLBACK_LOGO);
          try {
            await testImageLoad(DEFAULT_FALLBACK_LOGO);
            setCurrentImageUrl(DEFAULT_FALLBACK_LOGO);
            setImageStatus('loaded');
            console.log('Logo component: Successfully loaded fallback logo');
          } catch (fallbackError) {
            console.error('Logo component: Even fallback logo failed:', fallbackError);
            setImageStatus('error');
          }
        } else {
          setImageStatus('error');
        }
      }
    };

    loadImage();
  }, [logoConfig, isLoading]);

  const testImageLoad = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.error('Logo component: Image load timeout for:', url);
        reject(new Error('Image load timeout'));
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        console.log('Logo component: Image loaded successfully:', url);
        resolve();
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        console.error('Logo component: Image load failed for:', url, error);
        reject(new Error('Image load failed'));
      };
      
      // Set crossOrigin for Supabase storage URLs
      if (url.includes('supabase')) {
        img.crossOrigin = 'anonymous';
      }
      
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
  if (isLoading || imageStatus === 'loading') {
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
      alt="Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={(e) => {
        console.error('Logo component: Image onError triggered for:', currentImageUrl);
        setImageStatus('error');
      }}
      onLoad={() => {
        console.log('Logo component: Image onLoad triggered successfully for:', currentImageUrl);
      }}
    />
  );
};
