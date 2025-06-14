
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
      console.log('usePublicLogoConfig: Loading public logo configuration...');
      
      // Call the public function that doesn't require authentication
      const { data, error } = await supabase.rpc('get_public_logo_config');
      
      if (error) {
        console.error('usePublicLogoConfig: Error loading public logo config:', error);
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }

      if (data && data.length > 0) {
        const config = data[0];
        console.log('usePublicLogoConfig: Loaded public logo config:', config);
        
        const logoConfig = {
          activeLogoUrl: config.logo_url || DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: config.fallback_logo_url || DEFAULT_FALLBACK_LOGO
        };
        
        console.log('usePublicLogoConfig: Final logo config:', logoConfig);
        return logoConfig;
      } else {
        console.log('usePublicLogoConfig: No public logo configuration found, using defaults');
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }
    } catch (error) {
      console.error('usePublicLogoConfig: Failed to load public logo configuration:', error);
      return {
        activeLogoUrl: DEFAULT_FALLBACK_LOGO,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
      };
    }
  };

  useEffect(() => {
    const loadConfig = async () => {
      const config = await loadPublicLogoConfig();
      console.log('usePublicLogoConfig: Setting logo config:', config);
      setLogoConfig(config);
      setIsLoading(false);
    };

    loadConfig();
  }, []);

  const reload = async () => {
    console.log('usePublicLogoConfig: Manually reloading logo config');
    const config = await loadPublicLogoConfig();
    setLogoConfig(config);
  };

  return {
    logoConfig,
    isLoading,
    reload
  };
};
