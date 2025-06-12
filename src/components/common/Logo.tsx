
import React, { useState, useEffect } from 'react';
import { useLogoConfig } from '@/hooks/useLogoConfig';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageUrl, setImageUrl] = useState<string>('');
  const { logoConfig } = useLogoConfig();

  // Optimized size classes for horizontal logo
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[150px]', 
    lg: 'h-14 w-auto max-w-[200px]'
  };

  useEffect(() => {
    const loadImage = async () => {
      console.log('Loading logo:', logoConfig.activeLogoUrl);
      setImageStatus('loading');
      
      // First try the active logo URL
      const img = new Image();
      let loadTimeout: NodeJS.Timeout;
      
      const timeoutPromise = new Promise<void>((_, reject) => {
        loadTimeout = setTimeout(() => {
          reject(new Error('Image load timeout'));
        }, 8000); // Increased timeout to 8 seconds
      });

      const loadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          console.log('Logo loaded successfully:', logoConfig.activeLogoUrl);
          resolve();
        };
        
        img.onerror = (error) => {
          console.error('Logo failed to load:', logoConfig.activeLogoUrl, error);
          reject(new Error('Image load failed'));
        };
        
        // Set crossOrigin for Supabase storage URLs
        if (logoConfig.activeLogoUrl.includes('supabase')) {
          img.crossOrigin = 'anonymous';
        }
        
        img.src = logoConfig.activeLogoUrl;
      });

      try {
        await Promise.race([loadPromise, timeoutPromise]);
        clearTimeout(loadTimeout);
        setImageUrl(logoConfig.activeLogoUrl);
        setImageStatus('loaded');
      } catch (error) {
        console.warn('Active logo failed, trying fallback:', error);
        clearTimeout(loadTimeout);
        
        // Try fallback logo
        try {
          const fallbackImg = new Image();
          await new Promise<void>((resolve, reject) => {
            const fallbackTimeout = setTimeout(() => reject(new Error('Fallback timeout')), 3000);
            
            fallbackImg.onload = () => {
              clearTimeout(fallbackTimeout);
              resolve();
            };
            fallbackImg.onerror = () => {
              clearTimeout(fallbackTimeout);
              reject(new Error('Fallback failed'));
            };
            fallbackImg.src = logoConfig.fallbackLogoUrl;
          });
          
          console.log('Fallback logo loaded:', logoConfig.fallbackLogoUrl);
          setImageUrl(logoConfig.fallbackLogoUrl);
          setImageStatus('loaded');
        } catch (fallbackError) {
          console.error('Both active and fallback logos failed:', fallbackError);
          setImageStatus('error');
        }
      }
    };

    loadImage();
  }, [logoConfig.activeLogoUrl, logoConfig.fallbackLogoUrl]);

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
  if (imageStatus === 'loading') {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Show enhanced fallback if image failed to load
  if (imageStatus === 'error') {
    console.log('Showing fallback logo due to load error');
    return <FallbackLogo />;
  }

  // Display the actual logo
  return (
    <img
      src={imageUrl}
      alt="Figmant Logo"
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={() => {
        console.error('Image onError triggered for:', imageUrl);
        setImageStatus('error');
      }}
      onLoad={() => {
        console.log('Image onLoad triggered for:', imageUrl);
      }}
    />
  );
};
