
import React, { useState, useMemo, useEffect } from 'react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { AllAnalysisFilters } from './analysis/AllAnalysisFilters';
import { AllAnalysisTable } from './analysis/AllAnalysisTable';
import { AnalysisDetailView } from './analysis/AnalysisDetailView';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AllAnalysisPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch data
  const { data: uploads = [], isLoading: uploadsLoading, refetch: refetchUploads } = useDesignUploads();
  const { data: batchAnalyses = [], isLoading: batchLoading, refetch: refetchBatch } = useDesignBatchAnalyses();
  const { data: individualAnalyses = [], isLoading: individualLoading, refetch: refetchIndividual } = useDesignAnalyses();

  // Set up real-time subscriptions for analysis updates
  useEffect(() => {
    console.log('Setting up real-time subscriptions for analysis updates...');
    
    const analysisChannel = supabase
      .channel('analysis-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'design_analysis'
        },
        (payload) => {
          console.log('Real-time: New analysis inserted:', payload);
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
          
          // Show toast notification for new analysis
          toast({
            title: "New Analysis Available",
            description: "A new analysis has been completed and is now visible.",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'design_batch_analysis'
        },
        (payload) => {
          console.log('Real-time: New batch analysis inserted:', payload);
          queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
          
          toast({
            title: "New Batch Analysis Available",
            description: "A new batch analysis has been completed and is now visible.",
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions...');
      supabase.removeChannel(analysisChannel);
    };
  }, [queryClient, toast]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    console.log('Manual refresh triggered...');
    setIsRefreshing(true);
    
    try {
      await Promise.all([
        refetchUploads(),
        refetchBatch(),
        refetchIndividual()
      ]);
      
      toast({
        title: "Data Refreshed",
        description: "All analysis data has been refreshed successfully.",
      });
    } catch (error) {
      console.error('Error during manual refresh:', error);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Combine and process all analyses
  const allAnalyses = useMemo(() => {
    console.log('Processing all analyses:', {
      individualCount: individualAnalyses.length,
      batchCount: batchAnalyses.length,
      uploadsCount: uploads.length
    });

    const individual = individualAnalyses.map(analysis => {
      const upload = uploads.find(u => u.id === analysis.design_upload_id);
      return {
        id: analysis.id,
        type: 'individual',
        title: upload?.file_name || 'Chat Analysis',
        status: upload?.status || 'completed',
        created_at: analysis.created_at,
        confidence_score: analysis.confidence_score,
        analysis_type: analysis.analysis_type,
        upload_count: 1,
        winner_upload_id: null,
        batch_name: null,
        rawData: analysis,
        relatedUpload: upload
      };
    });

    const batch = batchAnalyses.map(analysis => {
      const batchUploads = uploads.filter(u => u.batch_id === analysis.batch_id);
      const batchName = batchUploads[0]?.batch_name || `Batch ${analysis.batch_id.slice(0, 8)}`;
      
      return {
        id: analysis.id,
        type: 'batch',
        title: batchName,
        status: 'completed',
        created_at: analysis.created_at,
        confidence_score: analysis.confidence_score,
        analysis_type: analysis.analysis_type,
        upload_count: batchUploads.length,
        winner_upload_id: analysis.winner_upload_id,
        batch_name: batchName,
        rawData: analysis,
        relatedUploads: batchUploads
      };
    });

    const combined = [...individual, ...batch].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log('Combined analyses result:', {
      totalCount: combined.length,
      individualCount: individual.length,
      batchCount: batch.length,
      latestAnalysis: combined[0]?.created_at
    });

    return combined;
  }, [individualAnalyses, batchAnalyses, uploads]);

  // Filter analyses
  const filteredAnalyses = useMemo(() => {
    return allAnalyses.filter(analysis => {
      const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          analysis.analysis_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;
      const matchesType = typeFilter === 'all' || analysis.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allAnalyses, searchTerm, statusFilter, typeFilter]);

  const handleViewAnalysis = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const handleRowClick = (analysis: any) => {
    handleViewAnalysis(analysis);
  };

  if (uploadsLoading || batchLoading || individualLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <AnalysisDetailView 
        analysis={selectedAnalysis} 
        onBack={() => setSelectedAnalysis(null)} 
      />
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Analysis</h1>
          <p className="text-muted-foreground">
            View and manage all your design analyses in one place
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="text-sm text-muted-foreground">
            {filteredAnalyses.length} of {allAnalyses.length} analyses
          </div>
        </div>
      </div>

      <AllAnalysisFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      <AllAnalysisTable
        analyses={filteredAnalyses}
        onRowClick={handleRowClick}
        onViewAnalysis={handleViewAnalysis}
      />
    </div>
  );
};
