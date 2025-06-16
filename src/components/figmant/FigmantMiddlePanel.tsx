
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useAnalysisFilters } from '@/hooks/useAnalysisFilters';
import { EnhancedAnalysisCard } from './components/EnhancedAnalysisCard';
import { AnalysisFiltersPanel } from './components/AnalysisFiltersPanel';
import { useToast } from '@/hooks/use-toast';

interface FigmantMiddlePanelProps {
  activeSection: string;
  onAnalysisSelect: (analysis: any) => void;
  selectedAnalysis: any;
}

export const FigmantMiddlePanel: React.FC<FigmantMiddlePanelProps> = ({
  activeSection,
  onAnalysisSelect,
  selectedAnalysis
}) => {
  const { toast } = useToast();
  const { data: uploads = [] } = useDesignUploads();
  const { data: analyses = [] } = useDesignAnalyses();
  const { filters, updateFilter, resetFilters, applyFilters } = useAnalysisFilters();

  const handleDeleteAnalysis = (analysisId: string) => {
    // TODO: Implement delete functionality
    toast({
      title: "Delete Analysis",
      description: "Analysis deletion will be implemented in the next phase.",
    });
  };

  const handleShareAnalysis = (analysis: any) => {
    // TODO: Implement share functionality
    toast({
      title: "Share Analysis", 
      description: "Analysis sharing will be implemented in the next phase.",
    });
  };

  const handleDownloadAnalysis = (analysis: any) => {
    // TODO: Implement download functionality
    toast({
      title: "Download Report",
      description: "Report download will be implemented in the next phase.",
    });
  };

  const renderAnalysisSection = () => {
    const filteredAnalyses = applyFilters(analyses);

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Analysis</h2>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
          
          {/* Filters Panel */}
          <AnalysisFiltersPanel
            filters={filters}
            onFilterChange={updateFilter}
            onResetFilters={resetFilters}
            resultCount={filteredAnalyses.length}
          />
        </div>

        {/* Analysis List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAnalyses.length > 0 ? (
            filteredAnalyses.map((analysis) => (
              <EnhancedAnalysisCard
                key={analysis.id}
                analysis={analysis}
                isSelected={selectedAnalysis?.id === analysis.id}
                onClick={() => onAnalysisSelect(analysis)}
                onDelete={handleDeleteAnalysis}
                onShare={handleShareAnalysis}
                onDownload={handleDownloadAnalysis}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filters.searchTerm || filters.statusFilter !== 'all' || filters.typeFilter !== 'all'
                  ? 'No analyses found'
                  : 'No analyses yet'
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {filters.searchTerm || filters.statusFilter !== 'all' || filters.typeFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Start by creating your first analysis'
                }
              </p>
              {(!filters.searchTerm && filters.statusFilter === 'all' && filters.typeFilter === 'all') && (
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Analysis
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDashboardSection = () => (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Recent Activity</h3>
          <p className="text-sm text-gray-600">Your latest analyses and insights</p>
        </div>
      </div>
    </div>
  );

  const renderDefaultSection = () => (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{activeSection}</h2>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Content for {activeSection} will be displayed here
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'analysis':
        return renderAnalysisSection();
      case 'dashboard':
        return renderDashboardSection();
      default:
        return renderDefaultSection();
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {renderContent()}
    </div>
  );
};
