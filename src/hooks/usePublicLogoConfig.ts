
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
      
      // Get both main and collapsed logo URLs from admin_settings
      const { data: logoData, error: logoError } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['logo_url', 'collapsed_logo_url']);
        
      if (logoError) {
        console.error('usePublicLogoConfig: Error loading logo settings:', logoError);
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }

      let activeLogoUrl = DEFAULT_FALLBACK_LOGO;
      let collapsedLogoUrl: string | undefined;

      // Process the settings data
      if (logoData && logoData.length > 0) {
        for (const setting of logoData) {
          let logoUrl: string;
          if (typeof setting.setting_value === 'string') {
            logoUrl = setting.setting_value;
          } else if (typeof setting.setting_value === 'object' && setting.setting_value !== null && 'value' in setting.setting_value) {
            logoUrl = setting.setting_value.value as string;
          } else {
            continue;
          }

          if (setting.setting_key === 'logo_url') {
            activeLogoUrl = logoUrl;
          } else if (setting.setting_key === 'collapsed_logo_url') {
            collapsedLogoUrl = logoUrl;
          }
        }
      }

      console.log('usePublicLogoConfig: Final logo config:', { activeLogoUrl, collapsedLogoUrl });
      
      return {
        activeLogoUrl,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO,
        collapsedLogoUrl
      };
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
