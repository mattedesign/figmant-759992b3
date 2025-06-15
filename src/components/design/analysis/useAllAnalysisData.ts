
import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useGroupedAnalyses } from '@/hooks/useGroupedAnalyses';
import { useToast } from '@/hooks/use-toast';

export const useAllAnalysisData = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch data
  const { data: uploads = [], isLoading: uploadsLoading, refetch: refetchUploads } = useDesignUploads();
  const { data: batchAnalyses = [], isLoading: batchLoading, refetch: refetchBatch } = useDesignBatchAnalyses();
  const { data: individualAnalyses = [], isLoading: individualLoading, refetch: refetchIndividual } = useDesignAnalyses();

  // Group analyses using the hook
  const groupedAnalyses = useGroupedAnalyses(uploads, individualAnalyses, batchAnalyses);

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
          queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
          
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

  // Convert grouped analyses back to flat list for filtering in table view
  const allAnalyses = useMemo(() => {
    const flatAnalyses: any[] = [];
    
    groupedAnalyses.forEach(group => {
      // Add the primary analysis
      flatAnalyses.push(group.primaryAnalysis);
      // Add all related analyses
      flatAnalyses.push(...group.relatedAnalyses);
    });
    
    return flatAnalyses.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [groupedAnalyses]);

  const isLoading = uploadsLoading || batchLoading || individualLoading;

  return {
    uploads,
    batchAnalyses,
    individualAnalyses,
    groupedAnalyses,
    allAnalyses,
    isLoading,
    isRefreshing,
    handleManualRefresh
  };
};
