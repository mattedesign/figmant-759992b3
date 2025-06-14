
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { DesignList } from './DesignList';
import { ClaudeAISetupPrompt } from './ClaudeAISetupPrompt';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useToast } from '@/hooks/use-toast';
import { DesignUpload } from '@/types/design';

export const LegacyDesignPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: claudeSettings, isLoading: claudeLoading } = useClaudeSettings();
  const { refetch: refetchUploads } = useDesignUploads();
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchUploads();
    toast({
      title: "Refreshed",
      description: "Design data has been refreshed.",
    });
  };

  const handleViewAnalysis = (upload: DesignUpload) => {
    // Navigate to analysis view or open modal
    console.log('Viewing analysis:', upload.id, upload.file_name);
  };

  const showClaudeSetup = !claudeLoading && (!claudeSettings?.claude_ai_enabled);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Legacy Design View</h1>
          <p className="text-muted-foreground">
            Classic view of uploaded designs and analysis
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

      <DesignList key={refreshKey} onViewAnalysis={handleViewAnalysis} />
    </div>
  );
};
