
import React, { createContext, useContext, useEffect } from 'react';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useAuthState } from '@/hooks/useAuthState';

interface AnalyticsContextType {
  logCustomActivity: (activityType: string, metadata?: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logCustomActivity } = useActivityTracker();
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      logCustomActivity('login', {
        userId: user.id,
        email: user.email
      });
    }
  }, [user, logCustomActivity]);

  const value = {
    logCustomActivity
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
