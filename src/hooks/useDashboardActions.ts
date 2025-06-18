
import { useCallback } from 'react';

interface UseDashboardActionsProps {
  refetchAnalyses: () => Promise<any>;
  refetchInsights: () => Promise<any>;
  refetchPrompts: () => Promise<any>;
}

export const useDashboardActions = ({
  refetchAnalyses,
  refetchInsights,
  refetchPrompts
}: UseDashboardActionsProps) => {
  // Enhanced refresh functions
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      refetchAnalyses(),
      refetchInsights(),
      refetchPrompts()
    ]);
  }, [refetchAnalyses, refetchInsights, refetchPrompts]);

  return {
    refreshAllData,
    refreshAnalyses: refetchAnalyses,
    refreshInsights: refetchInsights,
    refreshPrompts: refetchPrompts
  };
};
