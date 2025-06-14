
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LogoConfig, LogoType } from '@/types/logo';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';
import { DEFAULT_FALLBACK_LOGO } from '@/types/logo';

interface LogoContextValue {
  logoConfig: LogoConfig;
  isLoading: boolean;
  getLogoUrl: (type: LogoType) => string;
  updateLogo: (type: LogoType, url: string) => Promise<boolean>;
  reload: () => Promise<void>;
}

const LogoContext = createContext<LogoContextValue | undefined>(undefined);

export const useLogoContext = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogoContext must be used within a LogoProvider');
  }
  return context;
};

interface LogoProviderProps {
  children: React.ReactNode;
}

export const LogoProvider: React.FC<LogoProviderProps> = ({ children }) => {
  const { logoConfig: publicConfig, isLoading: publicLoading, reload: reloadPublic } = usePublicLogoConfig();
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    activeLogoUrl: DEFAULT_FALLBACK_LOGO,
    fallbackLogoUrl: DEFAULT_FALLBACK_LOGO,
    iconLogoUrl: DEFAULT_FALLBACK_LOGO,
    brandLogoUrl: DEFAULT_FALLBACK_LOGO
  });

  useEffect(() => {
    if (!publicLoading && publicConfig) {
      setLogoConfig(prev => ({
        ...prev,
        activeLogoUrl: publicConfig.activeLogoUrl,
        fallbackLogoUrl: publicConfig.fallbackLogoUrl,
        // Use the same logo for both types initially
        iconLogoUrl: publicConfig.activeLogoUrl,
        brandLogoUrl: publicConfig.activeLogoUrl
      }));
    }
  }, [publicConfig, publicLoading]);

  const getLogoUrl = (type: LogoType): string => {
    switch (type) {
      case 'icon':
        return logoConfig.iconLogoUrl || logoConfig.activeLogoUrl;
      case 'brand':
        return logoConfig.brandLogoUrl || logoConfig.activeLogoUrl;
      default:
        return logoConfig.activeLogoUrl;
    }
  };

  const updateLogo = async (type: LogoType, url: string): Promise<boolean> => {
    try {
      // Update local state immediately for better UX
      setLogoConfig(prev => ({
        ...prev,
        [`${type}LogoUrl`]: url,
        // Also update active logo if this is the primary type
        ...(type === 'brand' && { activeLogoUrl: url })
      }));
      
      console.log(`Logo updated for type ${type}:`, url);
      return true;
    } catch (error) {
      console.error('Failed to update logo:', error);
      return false;
    }
  };

  const reload = async () => {
    await reloadPublic();
  };

  const value: LogoContextValue = {
    logoConfig,
    isLoading: publicLoading,
    getLogoUrl,
    updateLogo,
    reload
  };

  return (
    <LogoContext.Provider value={value}>
      {children}
    </LogoContext.Provider>
  );
};
