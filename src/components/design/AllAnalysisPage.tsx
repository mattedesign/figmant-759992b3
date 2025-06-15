
import React, { useState, useMemo, useEffect } from 'react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useGroupedAnalyses } from '@/hooks/useGroupedAnalyses';
import { AllAnalysisFilters } from './analysis/AllAnalysisFilters';
import { AllAnalysisTable } from './analysis/AllAnalysisTable';
import { GroupedAnalysisTable } from './analysis/GroupedAnalysisTable';
import { AnalysisDetailView } from './analysis/AnalysisDetailView';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AllAnalysisPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch data
  const { data: uploads = [], isLoading: uploadsLoading, refetch: refetchUploads } = useDesignUploads();
  const { data: batchAnalyses = [], isLoading: batchLoading, refetch: refetchBatch } = useDesignBatchAnalyses();
  const { data: individualAnalyses = [], isLoading: individualLoading, refetch: refetchIndividual } = useDesignAnalyses();

  // Group analyses using the new hook
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

  // Filter analyses based on current filters
  const filteredAnalyses = useMemo(() => {
    return allAnalyses.filter(analysis => {
      const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          analysis.analysis_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;
      const matchesType = typeFilter === 'all' || analysis.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allAnalyses, searchTerm, statusFilter, typeFilter]);

  // Filter grouped analyses
  const filteredGroupedAnalyses = useMemo(() => {
    return groupedAnalyses.filter(group => {
      const matchesSearch = group.groupTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.primaryAnalysis.analysis_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || group.primaryAnalysis.status === statusFilter;
      const matchesType = typeFilter === 'all' || group.groupType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [groupedAnalyses, searchTerm, statusFilter, typeFilter]);

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
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grouped' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grouped')}
              className="flex items-center gap-2"
            >
              <Grid className="h-4 w-4" />
              Grouped
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Table
            </Button>
          </div>
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
            {viewMode === 'grouped' 
              ? `${filteredGroupedAnalyses.length} of ${groupedAnalyses.length} groups`
              : `${filteredAnalyses.length} of ${allAnalyses.length} analyses`
            }
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

      {viewMode === 'grouped' ? (
        <GroupedAnalysisTable
          groupedAnalyses={filteredGroupedAnalyses}
          onViewAnalysis={handleViewAnalysis}
        />
      ) : (
        <AllAnalysisTable
          analyses={filteredAnalyses}
          onRowClick={handleRowClick}
          onViewAnalysis={handleViewAnalysis}
        />
      )}
    </div>
  );
};
