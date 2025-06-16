
import React, { useState, useEffect } from 'react';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
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
      console.log('logoConfig.activeLogoUrl:', logoConfig.activeLogoUrl);
      
      setImageStatus('loading');
      
      // Use the logo from the configuration system
      const logoToTest = logoConfig.activeLogoUrl;
      
      console.log('Logo component: Testing logo URL from config:', logoToTest);
      
      if (!logoToTest || logoToTest === '') {
        console.log('Logo component: No logo URL found in config, showing fallback');
        setImageStatus('error');
        return;
      }
      
      try {
        const isAccessible = await testImageLoad(logoToTest);
        
        if (isAccessible) {
          setImageStatus('loaded');
          console.log('✓ Logo component: Successfully loaded logo from config:', logoToTest);
        } else {
          console.warn('✗ Logo component: Failed to load logo from config, showing fallback');
          setImageStatus('error');
        }
      } catch (error) {
        console.error('Logo component: Error during image loading:', error);
        setImageStatus('error');
      }
    };

    if (!isLoading) {
      loadImage();
    }
  }, [logoConfig.activeLogoUrl, isLoading]);

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

  // Always show the default logo image first, fallback to text only if it fails
  const defaultLogoUrl = '/lovable-uploads/235bdb67-21d3-44ed-968a-518226eef780.png';

  // Loading placeholder
  if (isLoading || imageStatus === 'loading') {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // If we have a configured logo URL and it loaded successfully, show it
  if (imageStatus === 'loaded' && logoConfig.activeLogoUrl) {
    console.log('Logo component: Displaying configured logo:', logoConfig.activeLogoUrl);
    return (
      <img
        src={logoConfig.activeLogoUrl}
        alt="Figmant Logo"
        className={`${sizeClasses[size]} ${className} object-contain`}
        onError={(e) => {
          console.error('Logo component: Image onError triggered for:', logoConfig.activeLogoUrl);
          setImageStatus('error');
        }}
        onLoad={() => {
          console.log('✓ Logo component: Image onLoad triggered successfully for:', logoConfig.activeLogoUrl);
        }}
      />
    );
  }

  // Try to show the default logo image before falling back to text
  console.log('Logo component: Trying to show default logo image:', defaultLogoUrl);
  return (
    <img
      src={defaultLogoUrl}
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={(e) => {
        console.error('Logo component: Default logo also failed, showing text fallback');
        // If even the default logo fails, replace with fallback component
        e.currentTarget.style.display = 'none';
        const fallbackEl = document.createElement('div');
        fallbackEl.innerHTML = `
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
        e.currentTarget.parentNode?.appendChild(fallbackEl);
      }}
      onLoad={() => {
        console.log('✓ Logo component: Default logo loaded successfully');
      }}
    />
  );
};
