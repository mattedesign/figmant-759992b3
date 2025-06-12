
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_FALLBACK_LOGO, type LogoConfig } from './logo/types';

export const usePublicLogoConfig = () => {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    activeLogoUrl: DEFAULT_FALLBACK_LOGO,
    fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadPublicLogoConfig = async () => {
    try {
      setIsLoading(true);
      console.log('Loading public logo configuration...');
      
      // Call the public function that doesn't require authentication
      const { data, error } = await supabase.rpc('get_public_logo_config');
      
      if (error) {
        console.error('Error loading public logo config:', error);
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }

      if (data && data.length > 0) {
        const config = data[0];
        console.log('Loaded public logo config:', config);
        return {
          activeLogoUrl: config.logo_url || DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: config.fallback_logo_url || DEFAULT_FALLBACK_LOGO
        };
      } else {
        console.log('No public logo configuration found, using defaults');
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }
    } catch (error) {
      console.error('Failed to load public logo configuration:', error);
      return {
        activeLogoUrl: DEFAULT_FALLBACK_LOGO,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
      };
    }
  };

  useEffect(() => {
    const loadConfig = async () => {
      const config = await loadPublicLogoConfig();
      setLogoConfig(config);
      setIsLoading(false);
    };

    loadConfig();
  }, []);

  const reload = async () => {
    const config = await loadPublicLogoConfig();
    setLogoConfig(config);
  };

  return {
    logoConfig,
    isLoading,
    reload
  };
};
