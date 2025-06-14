
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
      console.log('=== LOADING PUBLIC LOGO CONFIG ===');
      
      // First, try to get the public logo configuration
      const { data, error } = await supabase.rpc('get_public_logo_config');
      
      if (error) {
        console.error('usePublicLogoConfig: Error loading public logo config:', error);
        
        // If function doesn't exist or fails, fall back to checking admin_settings
        console.log('usePublicLogoConfig: Fallback to admin_settings...');
        
        const { data: adminData, error: adminError } = await supabase
          .from('admin_settings')
          .select('setting_value')
          .eq('setting_key', 'logo_url')
          .maybeSingle();
          
        if (adminError) {
          console.error('usePublicLogoConfig: Admin settings query failed:', adminError);
        } else if (adminData?.setting_value) {
          // Handle both direct string values and object values with .value property
          let logoUrl: string;
          if (typeof adminData.setting_value === 'string') {
            logoUrl = adminData.setting_value;
          } else if (typeof adminData.setting_value === 'object' && adminData.setting_value !== null && 'value' in adminData.setting_value) {
            logoUrl = adminData.setting_value.value as string;
          } else {
            logoUrl = DEFAULT_FALLBACK_LOGO;
          }
          
          console.log('usePublicLogoConfig: Found logo in admin_settings:', logoUrl);
          
          return {
            activeLogoUrl: logoUrl,
            fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
          };
        }
        
        // Final fallback to default
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
    setIsLoading(true);
    const config = await loadPublicLogoConfig();
    setLogoConfig(config);
    setIsLoading(false);
  };

  return {
    logoConfig,
    isLoading,
    reload
  };
};
