
import React from 'react';
import { useAutomaticProfileRecovery } from '@/hooks/useAutomaticProfileRecovery';
import { useRegistrationMonitor } from '@/hooks/useRegistrationMonitor';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const EnhancedProfileSync: React.FC = () => {
  const { isRecovering } = useAutomaticProfileRecovery();
  const { user } = useAuth();
  useRegistrationMonitor();

  // Only show recovery message for specific users who experienced the issue
  const shouldShowRecovery = isRecovering && (
    user?.email === 'mbrown@triumphpay.com' || 
    user?.email === 'Mbrown@tfin.com'
  );

  if (shouldShowRecovery) {
    return (
      <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-800">Recovering your profile...</span>
        </div>
        <div className="text-xs text-blue-600 mt-1">
          This should only take a moment.
        </div>
      </div>
    );
  }

  return null;
};
