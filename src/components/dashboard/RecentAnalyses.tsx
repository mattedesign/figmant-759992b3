
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';
import { Target } from 'lucide-react';
import { AnalysisInsights } from './components/AnalysisInsights';
import { IndividualAnalysesList } from './components/IndividualAnalysesList';
import { BatchAnalysesList } from './components/BatchAnalysesList';

interface RecentAnalysesProps {
  onViewAnalysis: (upload: DesignUpload) => void;
  onViewBatchAnalysis?: (batchAnalysis: DesignBatchAnalysis) => void;
  limit?: number;
  showInsights?: boolean;
}

export const RecentAnalyses = ({ 
  onViewAnalysis, 
  onViewBatchAnalysis,
  limit = 5, 
  showInsights = false 
}: RecentAnalysesProps) => {
  const { data: uploads = [], isLoading } = useDesignUploads();
  const { data: individualAnalyses = [] } = useDesignAnalyses();
  const { data: batchAnalyses = [] } = useDesignBatchAnalyses();

  // Filter uploads with completed analyses - now all analyses should have impact summaries
  const recentUploads = uploads
    .filter(upload => upload.status === 'completed')
    .slice(0, limit);

  // All batch analyses should now have impact summaries
  const recentBatchAnalyses = batchAnalyses.slice(0, limit);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (recentUploads.length === 0 && recentBatchAnalyses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {showInsights ? 'No analysis insights available yet' : 'No completed analyses yet'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload a design to get started with AI-powered analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showInsights) {
    return (
      <AnalysisInsights
        uploads={uploads}
        recentUploads={recentUploads}
        recentBatchAnalyses={recentBatchAnalyses}
        onViewAnalysis={onViewAnalysis}
        onViewBatchAnalysis={onViewBatchAnalysis}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual ({recentUploads.length})</TabsTrigger>
          <TabsTrigger value="batch">Batch ({recentBatchAnalyses.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual" className="mt-4">
          <IndividualAnalysesList
            uploads={recentUploads}
            analyses={individualAnalyses}
            onViewAnalysis={onViewAnalysis}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
        
        <TabsContent value="batch" className="mt-4">
          <BatchAnalysesList
            batchAnalyses={recentBatchAnalyses}
            onViewBatchAnalysis={onViewBatchAnalysis}
          />
        </TabsContent>
      </Tabs>
      
      {(uploads.length > limit || recentBatchAnalyses.length > limit) && (
        <div className="text-center pt-2">
          <Button variant="outline" size="sm">
            View All Analyses
          </Button>
        </div>
      )}
    </div>
  );
};
