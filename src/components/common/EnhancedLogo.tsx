
import React, { useState, useEffect } from 'react';
import { LogoType } from '@/types/logo';
import { useLogoContext } from '@/contexts/LogoContext';
import { DEFAULT_FALLBACK_LOGO } from '@/types/logo';

interface EnhancedLogoProps {
  type: LogoType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallbackToDefault?: boolean;
}

export const EnhancedLogo: React.FC<EnhancedLogoProps> = ({ 
  type, 
  size = 'md', 
  className = '',
  fallbackToDefault = true
}) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(DEFAULT_FALLBACK_LOGO);
  const { getLogoUrl, isLoading } = useLogoContext();

  // Optimized size classes for different logo types
  const sizeClasses = {
    sm: type === 'icon' ? 'h-8 w-8' : 'h-8 w-auto max-w-[120px]',
    md: type === 'icon' ? 'h-10 w-10' : 'h-10 w-auto max-w-[150px]', 
    lg: type === 'icon' ? 'h-16 w-16' : 'h-16 w-auto max-w-[200px]'
  };

  useEffect(() => {
    if (isLoading) return;
    
    const loadImage = async () => {
      console.log(`=== ENHANCED LOGO: LOADING ${type.toUpperCase()} IMAGE ===`);
      
      setImageStatus('loading');
      
      const logoUrl = getLogoUrl(type);
      console.log(`Enhanced logo: Testing ${type} logo URL:`, logoUrl);
      
      try {
        const isAccessible = await testImageLoad(logoUrl);
        
        if (isAccessible) {
          setCurrentImageUrl(logoUrl);
          setImageStatus('loaded');
          console.log(`✓ Enhanced logo: Successfully loaded ${type} logo:`, logoUrl);
        } else {
          console.warn(`✗ Enhanced logo: Failed to load ${type} logo, trying fallback`);
          
          if (fallbackToDefault && logoUrl !== DEFAULT_FALLBACK_LOGO) {
            const fallbackAccessible = await testImageLoad(DEFAULT_FALLBACK_LOGO);
            
            if (fallbackAccessible) {
              setCurrentImageUrl(DEFAULT_FALLBACK_LOGO);
              setImageStatus('loaded');
              console.log(`✓ Enhanced logo: Successfully loaded fallback for ${type}`);
            } else {
              console.error(`✗ Enhanced logo: Even fallback failed for ${type}`);
              setImageStatus('error');
            }
          } else {
            setImageStatus('error');
          }
        }
      } catch (error) {
        console.error(`Enhanced logo: Error loading ${type} logo:`, error);
        setImageStatus('error');
      }
    };

    loadImage();
  }, [type, getLogoUrl, isLoading, fallbackToDefault]);

  const testImageLoad = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log(`Enhanced logo: Testing image load for ${type}:`, url);
      
      // For local assets, assume they're accessible
      if (url.startsWith('/lovable-uploads/') || url.startsWith('/')) {
        console.log(`Enhanced logo: Local asset detected for ${type}, assuming accessible`);
        resolve(true);
        return;
      }
      
      const img = new Image();
      const timeout = setTimeout(() => {
        console.error(`Enhanced logo: Image load timeout for ${type}:`, url);
        resolve(false);
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        console.log(`✓ Enhanced logo: Image loaded successfully for ${type}:`, url);
        resolve(true);
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`✗ Enhanced logo: Image load failed for ${type}:`, url, error);
        resolve(false);
      };
      
      // Set crossOrigin for Supabase storage URLs
      if (url.includes('supabase')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.src = url;
    });
  };

  // Fallback component based on logo type
  const FallbackLogo = () => {
    if (type === 'icon') {
      // Simple icon fallback
      return (
        <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg`}>
          <span className="text-white font-bold text-xs">F</span>
        </div>
      );
    } else {
      // Brand logo fallback
      return (
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
    }
  };

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
    console.log(`Enhanced logo: Showing fallback for ${type} due to load errors`);
    return <FallbackLogo />;
  }

  // Display the actual logo
  return (
    <img
      src={currentImageUrl}
      alt={`${type} Logo`}
      className={`${sizeClasses[size]} ${className} ${type === 'icon' ? 'object-cover rounded-lg' : 'object-contain'}`}
      onError={(e) => {
        console.error(`Enhanced logo: Image onError triggered for ${type}:`, currentImageUrl);
        setImageStatus('error');
      }}
      onLoad={() => {
        console.log(`✓ Enhanced logo: Image onLoad triggered successfully for ${type}:`, currentImageUrl);
      }}
    />
  );
};
