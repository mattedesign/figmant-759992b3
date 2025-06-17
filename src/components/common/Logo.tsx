
import React, { useState, useEffect } from 'react';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'expanded' | 'collapsed'; // New prop for logo variant
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', variant = 'expanded' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');
  const { logoConfig, isLoading } = usePublicLogoConfig();

  // Optimized size classes for the logo - updated to make default size 32px
  const sizeClasses = {
    sm: 'h-6 w-auto max-w-[100px]',
    md: 'h-8 w-auto max-w-[120px]', 
    lg: 'h-12 w-auto max-w-[150px]'
  };

  useEffect(() => {
    const loadImage = async () => {
      console.log('=== LOGO COMPONENT DEBUG ===');
      console.log('isLoading:', isLoading);
      console.log('logoConfig:', logoConfig);
      console.log('variant:', variant);
      
      setImageStatus('loading');
      
      // Choose the appropriate logo based on variant
      let logoToTest: string;
      if (variant === 'collapsed' && logoConfig.collapsedLogoUrl) {
        logoToTest = logoConfig.collapsedLogoUrl;
        console.log('Logo component: Using collapsed logo URL:', logoToTest);
      } else {
        logoToTest = logoConfig.activeLogoUrl;
        console.log('Logo component: Using expanded logo URL:', logoToTest);
      }
      
      if (!logoToTest || logoToTest === '') {
        console.log('Logo component: No logo URL found in config, using default');
        setCurrentLogoUrl('/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png');
        setImageStatus('loaded');
        return;
      }
      
      try {
        const isAccessible = await testImageLoad(logoToTest);
        
        if (isAccessible) {
          setCurrentLogoUrl(logoToTest);
          setImageStatus('loaded');
          console.log('✓ Logo component: Successfully loaded logo from config:', logoToTest);
        } else {
          console.warn('✗ Logo component: Failed to load logo from config, using default');
          setCurrentLogoUrl('/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png');
          setImageStatus('loaded');
        }
      } catch (error) {
        console.error('Logo component: Error during image loading:', error);
        setCurrentLogoUrl('/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png');
        setImageStatus('loaded');
      }
    };

    if (!isLoading) {
      loadImage();
    }
  }, [logoConfig.activeLogoUrl, logoConfig.collapsedLogoUrl, isLoading, variant]);

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
      }, 3000); // Reduced timeout for mobile

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
  if (isLoading || imageStatus === 'loading') {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // If we have a logo URL and it's loaded, show it
  if (imageStatus === 'loaded' && currentLogoUrl) {
    console.log('Logo component: Displaying logo:', currentLogoUrl);
    return (
      <img
        src={currentLogoUrl}
        alt="Figmant Logo"
        className={`${sizeClasses[size]} ${className} object-contain`}
        onError={(e) => {
          console.error('Logo component: Image onError triggered for:', currentLogoUrl);
          // Replace with fallback on error
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentNode;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.innerHTML = `
              <div class="${sizeClasses[size]} ${className} flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-3 py-1">
                <div class="flex items-center space-x-1">
                  <span class="text-white font-bold text-sm tracking-wide">FIGMANT</span>
                  <div class="flex space-x-1 ml-2">
                    <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <div class="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <div class="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            `;
            parent.appendChild(fallback.firstElementChild!);
          }
        }}
        onLoad={() => {
          console.log('✓ Logo component: Image onLoad triggered successfully for:', currentLogoUrl);
        }}
      />
    );
  }

  // Final fallback
  console.log('Logo component: Showing fallback component');
  return <FallbackLogo />;
};
