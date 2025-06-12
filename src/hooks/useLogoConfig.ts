
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LogoConfig {
  activeLogoUrl: string;
  fallbackLogoUrl: string;
}

export const useLogoConfig = () => {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    activeLogoUrl: '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png',
    fallbackLogoUrl: '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load saved logo configuration from localStorage
    const savedConfig = localStorage.getItem('figmant-logo-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setLogoConfig(config);
      } catch (error) {
        console.error('Failed to parse saved logo config:', error);
      }
    }
  }, []);

  const testImageLoad = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.warn('Image load test timeout for:', url);
        resolve(false);
      }, 5000);

      img.onload = () => {
        console.log('Image load test successful for:', url);
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        console.error('Image load test failed for:', url);
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = url;
    });
  };

  const updateActiveLogo = async (newLogoUrl: string) => {
    console.log('Attempting to update active logo to:', newLogoUrl);
    
    // Test if the new logo URL is accessible
    const isAccessible = await testImageLoad(newLogoUrl);
    
    if (!isAccessible) {
      console.error('New logo URL is not accessible:', newLogoUrl);
      toast({
        variant: "destructive",
        title: "Logo Update Failed",
        description: "The new logo could not be loaded. Please check the file accessibility.",
      });
      return;
    }

    const newConfig = {
      ...logoConfig,
      activeLogoUrl: newLogoUrl
    };
    
    setLogoConfig(newConfig);
    localStorage.setItem('figmant-logo-config', JSON.stringify(newConfig));
    
    toast({
      title: "Logo Updated",
      description: "The active logo has been updated successfully.",
    });
    
    console.log('Active logo updated to:', newLogoUrl);
  };

  return {
    logoConfig,
    updateActiveLogo
  };
};
