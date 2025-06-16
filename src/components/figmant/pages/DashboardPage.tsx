
import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { RecentAnalysisSection } from './dashboard/RecentAnalysisSection';
import { InsightsSection } from './dashboard/InsightsSection';
import { PatternAnalysisSection } from './dashboard/PatternAnalysisSection';
import { MyPromptsSection } from './dashboard/MyPromptsSection';
import { NotesSection } from './dashboard/NotesSection';
import { useDashboardDataManager } from '@/hooks/useDashboardDataManager';

export const DashboardPage: React.FC = () => {
  const {
    analysisData,
    insightsData,
    promptsData,
    notesData,
    hasAnyData,
    dataStats,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refreshAllData,
    refreshAnalyses,
    refreshInsights,
    refreshPrompts,
    refreshNotes,
    loadingStates,
    errorStates
  } = useDashboardDataManager();

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-6 py-6 space-y-8">
        <DashboardHeader 
          dataStats={dataStats}
          lastUpdated={lastUpdated}
          onRefresh={refreshAllData}
          isRefreshing={isRefreshing}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <RecentAnalysisSection 
              analysisData={analysisData}
              isLoading={loadingStates.analyses}
              error={errorStates.analyses}
              onRetry={refreshAnalyses}
            />
            <InsightsSection 
              insightsData={insightsData}
              isLoading={loadingStates.insights}
              error={errorStates.insights}
              onRetry={refreshInsights}
            />
            <PatternAnalysisSection />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <MyPromptsSection 
              promptsData={promptsData}
              isLoading={loadingStates.prompts}
              error={errorStates.prompts}
              onRetry={refreshPrompts}
            />
            <NotesSection 
              notesData={notesData}
              isLoading={loadingStates.notes}
              error={errorStates.notes}
              onRetry={refreshNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
