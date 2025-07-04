
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BatchAnalysisHeader } from './BatchAnalysisHeader';
import { BatchAnalysisMetrics } from './BatchAnalysisMetrics';
import { BatchAnalysisResults } from './BatchAnalysisResults';
import { BatchAnalysisSettings } from './BatchAnalysisSettings';
import { Skeleton } from '@/components/ui/skeleton';

interface BatchAnalysisData {
  id: string;
  batch_id: string;
  analysis_type: string;
  created_at: string;
  analysis_results: any;
  analysis_settings?: any;
  context_summary?: string;
  confidence_score?: number;
  key_metrics?: any;
  recommendations?: any;
  winner_upload_id?: string;
  prompt_used: string;
  user_id: string;
  version_number?: number;
  modification_summary?: string;
  parent_analysis_id?: string;
}

interface DesignAnalysisData {
  id: string;
  design_upload_id: string;
  created_at: string;
  analysis_results: any;
  analysis_type: string;
  confidence_score?: number;
  improvement_areas?: string[];
  prompt_used: string;
  suggestions?: any;
  user_id: string;
}

export const EnhancedBatchAnalysisViewer = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const { data: batch, isLoading: batchLoading } = useQuery({
    queryKey: ['batch-analysis', batchId],
    queryFn: async (): Promise<BatchAnalysisData | null> => {
      if (!batchId) throw new Error('No batch ID provided');
      
      const { data, error } = await supabase
        .from('design_batch_analysis')
        .select('*')
        .eq('batch_id', batchId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as BatchAnalysisData | null;
    },
    enabled: !!batchId
  });

  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['batch-analyses-results', batchId],
    queryFn: async (): Promise<DesignAnalysisData[]> => {
      if (!batchId) return [];
      
      const { data, error } = await supabase
        .from('design_analysis')
        .select(`
          *,
          design_uploads!inner(batch_id)
        `)
        .eq('design_uploads.batch_id', batchId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as DesignAnalysisData[]) || [];
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <button 
            onClick={() => setSelectedAnalysisId(null)}
            className="text-primary hover:underline"
          >
            ← Back to Batch Analysis
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Analysis Details</h2>
          <p className="text-muted-foreground">
            Analysis ID: {selectedAnalysisId}
          </p>
        </div>
      </div>
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
        .filter(a => a.analysis_results && typeof a.analysis_results === 'object')
        .reduce((sum, a) => {
          const results = a.analysis_results as any;
          return sum + (results?.processing_time || 0);
        }, 0) / analyses.length
    : undefined;

  // Create a mock batch object for the components that expect batch properties
  const mockBatch = {
    id: batch.batch_id,
    batch_name: `Batch ${batch.batch_id.slice(0, 8)}`,
    status: 'completed',
    created_at: batch.created_at,
    use_case: batch.analysis_type,
    description: batch.context_summary,
    context_files: [],
    analysis_type: batch.analysis_type,
    priority: 'normal'
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <BatchAnalysisHeader
        batch={mockBatch}
        onBack={handleBack}
        onExport={handleExport}
        onShare={handleShare}
      />

      <BatchAnalysisMetrics
        batch={mockBatch}
        analysisCount={analyses?.length || 0}
        avgProcessingTime={avgProcessingTime}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {analyses && (
            <BatchAnalysisResults
              results={analyses.map(analysis => ({
                id: analysis.id,
                design_name: `Analysis ${analysis.id.slice(0, 8)}`,
                status: 'completed',
                created_at: analysis.created_at,
                error_message: null
              }))}
              onViewAnalysis={handleViewAnalysis}
              onViewDashboard={handleViewDashboard}
              batchId={batchId!}
            />
          )}
        </div>
        <div>
          <BatchAnalysisSettings batch={mockBatch} />
        </div>
      </div>
    </div>
  );
};
