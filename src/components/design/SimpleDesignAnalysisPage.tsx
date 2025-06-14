
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Target } from 'lucide-react';
import { DesignChatInterface } from './DesignChatInterface';
import { ClaudeAISetupPrompt } from './ClaudeAISetupPrompt';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SimpleDesignAnalysisPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: claudeSettings, isLoading: claudeLoading } = useClaudeSettings();
  const { data: uploads, refetch: refetchUploads } = useDesignUploads();
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchUploads();
    toast({
      title: "Refreshed",
      description: "Design analysis data has been refreshed.",
    });
  };

  const retryFailedAnalyses = async () => {
    if (!uploads) return;

    const failedUploads = uploads.filter(upload => upload.status === 'failed');
    
    if (failedUploads.length === 0) {
      toast({
        title: "No Failed Analyses",
        description: "All uploads have been processed successfully.",
      });
      return;
    }

    try {
      // Update failed uploads to retry status
      for (const upload of failedUploads) {
        await supabase
          .from('design_uploads')
          .update({ status: 'pending' })
          .eq('id', upload.id);
      }

      toast({
        title: "Retrying Failed Analyses",
        description: `${failedUploads.length} failed uploads will be retried.`,
      });

      // Refresh data
      refetchUploads();
    } catch (error) {
      console.error('Error retrying failed analyses:', error);
      toast({
        variant: "destructive",
        title: "Retry Failed",
        description: "Failed to retry the analyses. Please try again.",
      });
    }
  };

  const showClaudeSetup = !claudeLoading && (!claudeSettings?.claude_ai_enabled);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Design Analysis</h1>
          <p className="text-muted-foreground">
            Chat with AI for comprehensive UX insights and design analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={retryFailedAnalyses}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Failed
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {showClaudeSetup && (
        <ClaudeAISetupPrompt onSetupComplete={() => window.location.reload()} />
      )}

      <DesignChatInterface key={refreshKey} />
    </div>
  );
};
