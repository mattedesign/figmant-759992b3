
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, BarChart3, History, RefreshCw } from 'lucide-react';
import { DesignChatInterface } from './DesignChatInterface';
import { DesignList } from './DesignList';
import { BatchAnalysisDashboard } from './BatchAnalysisDashboard';
import { ClaudeAISetupPrompt } from './ClaudeAISetupPrompt';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DesignUpload } from '@/types/design';

export const AdvancedDesignAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
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

  const handleViewAnalysis = (upload: DesignUpload) => {
    // Navigate to analysis view or open modal
    console.log('Viewing analysis:', upload.id, upload.file_name);
  };

  const showClaudeSetup = !claudeLoading && (!claudeSettings?.claude_ai_enabled);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Design Analysis</h1>
          <p className="text-muted-foreground">
            Chat with AI for comprehensive UX insights, batch analysis, and design history
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>AI Chat Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Batch Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Analysis History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <DesignChatInterface key={refreshKey} />
        </TabsContent>

        <TabsContent value="batch" className="mt-6">
          <BatchAnalysisDashboard key={refreshKey} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <DesignList key={refreshKey} onViewAnalysis={handleViewAnalysis} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
