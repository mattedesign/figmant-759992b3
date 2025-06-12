
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoConfigOperations } from './logo/logoConfigOperations';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';
import { type LogoConfig } from './logo/types';

export const useLogoConfig = () => {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    activeLogoUrl: '',
    fallbackLogoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { loadLogoConfig, updateActiveLogo: updateActiveLogoDb, resetToDefault: resetToDefaultDb } = useLogoConfigOperations();
  const { logoConfig: publicLogoConfig, isLoading: publicLoading, reload: reloadPublic } = usePublicLogoConfig();

  const loadConfig = async () => {
    if (!user) {
      // If no user, use public configuration
      setLogoConfig(publicLogoConfig);
      setIsLoading(publicLoading);
      return;
    }

    try {
      setIsLoading(true);
      // For authenticated users, try to load personal config, fall back to public
      const config = await loadLogoConfig(user.id);
      
      // If user has no personal config, use public config
      if (!config.activeLogoUrl || config.activeLogoUrl === publicLogoConfig.activeLogoUrl) {
        setLogoConfig(publicLogoConfig);
      } else {
        setLogoConfig(config);
      }
    } catch (error) {
      console.error('Failed to load logo configuration:', error);
      // Fall back to public config on error
      setLogoConfig(publicLogoConfig);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // When public config changes, reload personal config
    if (!publicLoading) {
      loadConfig();
    }
  }, [user, publicLogoConfig, publicLoading]);

  const updateActiveLogo = async (newLogoUrl: string) => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    const success = await updateActiveLogoDb(user.id, newLogoUrl);
    if (success) {
      setLogoConfig(prev => ({
        ...prev,
        activeLogoUrl: newLogoUrl
      }));
    }
    return success;
  };

  const resetToDefault = async () => {
    if (!user) return false;

    const success = await resetToDefaultDb(user.id);
    if (success) {
      // Reset to public configuration
      setLogoConfig(publicLogoConfig);
    }
    return success;
  };

  const reload = async () => {
    await reloadPublic();
    await loadConfig();
  };

  return {
    logoConfig,
    isLoading,
    updateActiveLogo,
    resetToDefault,
    reload
  };
};
