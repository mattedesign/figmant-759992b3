
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { BatchAnalysisDashboard } from './BatchAnalysisDashboard';
import { ClaudeAISetupPrompt } from './ClaudeAISetupPrompt';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useToast } from '@/hooks/use-toast';

export const BatchAnalysisPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: claudeSettings, isLoading: claudeLoading } = useClaudeSettings();
  const { refetch: refetchUploads } = useDesignUploads();
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchUploads();
    toast({
      title: "Refreshed",
      description: "Batch analysis data has been refreshed.",
    });
  };

  const showClaudeSetup = !claudeLoading && (!claudeSettings?.claude_ai_enabled);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Batch Analysis</h1>
          <p className="text-muted-foreground">
            Analyze multiple designs simultaneously for comprehensive insights
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {showClaudeSetup && (
        <ClaudeAISetupPrompt onSetupComplete={() => window.location.reload()} />
      )}

      <BatchAnalysisDashboard key={refreshKey} />
    </div>
  );
};
