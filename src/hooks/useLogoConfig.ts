
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoConfigOperations } from './logo/logoConfigOperations';
import { DEFAULT_FALLBACK_LOGO, type LogoConfig } from './logo/types';

export const useLogoConfig = () => {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    activeLogoUrl: DEFAULT_FALLBACK_LOGO,
    fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { loadLogoConfig, updateActiveLogo: updateActiveLogoDb, resetToDefault: resetToDefaultDb } = useLogoConfigOperations();

  const loadConfig = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const config = await loadLogoConfig(user.id);
      setLogoConfig(config);
    } catch (error) {
      console.error('Failed to load logo configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, [user]);

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
      setLogoConfig({
        activeLogoUrl: DEFAULT_FALLBACK_LOGO,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
      });
    }
    return success;
  };

  return {
    logoConfig,
    isLoading,
    updateActiveLogo,
    resetToDefault,
    reload: loadConfig
  };
};
