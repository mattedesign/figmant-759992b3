
import React, { useState, useEffect } from 'react';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';
import { DEFAULT_FALLBACK_LOGO } from '@/hooks/logo/types';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(DEFAULT_FALLBACK_LOGO);
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
      console.log('=== LOGO COMPONENT: LOADING IMAGE ===');
      console.log('Logo config received:', logoConfig);
      
      setImageStatus('loading');
      
      // Determine which logo URL to test
      const logoToTest = logoConfig.activeLogoUrl || DEFAULT_FALLBACK_LOGO;
      
      console.log('Logo component: Testing logo URL:', logoToTest);
      
      try {
        const isAccessible = await testImageLoad(logoToTest);
        
        if (isAccessible) {
          setCurrentImageUrl(logoToTest);
          setImageStatus('loaded');
          console.log('✓ Logo component: Successfully loaded logo:', logoToTest);
        } else {
          console.warn('✗ Logo component: Failed to load configured logo, trying fallback');
          
          // If the configured logo fails and it's not already the default, try the default
          if (logoToTest !== DEFAULT_FALLBACK_LOGO) {
            const fallbackAccessible = await testImageLoad(DEFAULT_FALLBACK_LOGO);
            
            if (fallbackAccessible) {
              setCurrentImageUrl(DEFAULT_FALLBACK_LOGO);
              setImageStatus('loaded');
              console.log('✓ Logo component: Successfully loaded fallback logo');
            } else {
              console.error('✗ Logo component: Even fallback logo failed');
              setImageStatus('error');
            }
          } else {
            console.error('✗ Logo component: Default logo failed to load');
            setImageStatus('error');
          }
        }
      } catch (error) {
        console.error('Logo component: Error during image loading:', error);
        setImageStatus('error');
      }
    };

    loadImage();
  }, [logoConfig, isLoading]);

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
        console.log('✓ Logo component: Image onLoad triggered successfully for:', currentImageUrl);
      }}
    />
  );
};
