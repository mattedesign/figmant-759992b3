
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  const updateActiveLogo = (newLogoUrl: string) => {
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
