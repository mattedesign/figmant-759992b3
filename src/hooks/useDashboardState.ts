
interface UseDashboardStateProps {
  isAnalysesLoading: boolean;
  isInsightsLoading: boolean;
  isPromptsLoading: boolean;
  isCreditsLoading: boolean;
  analysesError: Error | null;
  insightsError: Error | null;
  promptsError: Error | null;
}

export const useDashboardState = ({
  isAnalysesLoading,
  isInsightsLoading,
  isPromptsLoading,
  isCreditsLoading,
  analysesError,
  insightsError,
  promptsError
}: UseDashboardStateProps) => {
  // Calculate loading states
  const isLoading = isAnalysesLoading || isInsightsLoading || isPromptsLoading || isCreditsLoading;
  const isRefreshing = false; // Can be enhanced with mutation state
  
  const loadingStates = {
    analyses: isAnalysesLoading,
    insights: isInsightsLoading,
    prompts: isPromptsLoading,
    credits: isCreditsLoading
  };

  const errorStates = {
    analyses: analysesError,
    insights: insightsError,
    prompts: promptsError
  };

  const error = analysesError || insightsError || promptsError;
  const lastUpdated = new Date().toISOString(); // Return as string, will be converted to Date in DashboardPage

  return {
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    loadingStates,
    errorStates
  };
};
