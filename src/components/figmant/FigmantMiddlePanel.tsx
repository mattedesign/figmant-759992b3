
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { FigmantAnalysisCard } from './components/FigmantAnalysisCard';

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
  const [searchTerm, setSearchTerm] = useState('');
  const { data: uploads = [] } = useDesignUploads();
  const { data: analyses = [] } = useDesignAnalyses();

  const renderAnalysisSection = () => {
    const filteredAnalyses = analyses.filter(analysis => 
      analysis.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              All
            </Button>
            <Badge variant="secondary">
              {filteredAnalyses.length} results
            </Badge>
          </div>
        </div>

        {/* Analysis List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAnalyses.length > 0 ? (
            filteredAnalyses.map((analysis) => (
              <FigmantAnalysisCard
                key={analysis.id}
                analysis={analysis}
                isSelected={selectedAnalysis?.id === analysis.id}
                onClick={() => onAnalysisSelect(analysis)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first analysis'}
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Analysis
              </Button>
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
