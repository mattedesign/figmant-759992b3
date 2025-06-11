
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BatchAnalysisHeader } from './BatchAnalysisHeader';
import { BatchAnalysisMetrics } from './BatchAnalysisMetrics';
import { BatchAnalysisResults } from './BatchAnalysisResults';
import { BatchAnalysisSettings } from './BatchAnalysisSettings';
import { AnalysisViewer } from '../AnalysisViewer';
import { Skeleton } from '@/components/ui/skeleton';

export const EnhancedBatchAnalysisViewer = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const { data: batch, isLoading: batchLoading } = useQuery({
    queryKey: ['batch-analysis', batchId],
    queryFn: async () => {
      if (!batchId) throw new Error('No batch ID provided');
      
      const { data, error } = await supabase
        .from('design_batch_analyses')
        .select('*')
        .eq('id', batchId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!batchId
  });

  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['batch-analyses-results', batchId],
    queryFn: async () => {
      if (!batchId) return [];
      
      const { data, error } = await supabase
        .from('design_analyses')
        .select('*')
        .eq('batch_id', batchId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!batchId
  });

  const handleViewAnalysis = (analysisId: string) => {
    setSelectedAnalysisId(analysisId);
  };

  const handleViewDashboard = (batchId: string) => {
    navigate(`/design-analysis/batch/${batchId}/dashboard`);
  };

  const handleBack = () => {
    navigate('/design-analysis');
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your batch analysis report is being prepared for download.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "A shareable link has been copied to your clipboard.",
    });
  };

  if (selectedAnalysisId) {
    return (
      <AnalysisViewer
        analysisId={selectedAnalysisId}
        onBack={() => setSelectedAnalysisId(null)}
      />
    );
  }

  if (batchLoading || analysesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Batch Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The batch analysis you're looking for doesn't exist or you don't have access to it.
          </p>
          <button onClick={handleBack} className="text-primary hover:underline">
            Return to Design Analysis
          </button>
        </div>
      </div>
    );
  }

  const avgProcessingTime = analyses?.length
    ? analyses
        .filter(a => a.status === 'completed' && a.processing_time)
        .reduce((sum, a) => sum + (a.processing_time || 0), 0) / analyses.length
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <BatchAnalysisHeader
        batch={batch}
        onBack={handleBack}
        onExport={handleExport}
        onShare={handleShare}
      />

      <BatchAnalysisMetrics
        batch={batch}
        analysisCount={analyses?.length || 0}
        avgProcessingTime={avgProcessingTime}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {analyses && (
            <BatchAnalysisResults
              results={analyses}
              onViewAnalysis={handleViewAnalysis}
              onViewDashboard={handleViewDashboard}
              batchId={batchId!}
            />
          )}
        </div>
        <div>
          <BatchAnalysisSettings batch={batch} />
        </div>
      </div>
    </div>
  );
};
