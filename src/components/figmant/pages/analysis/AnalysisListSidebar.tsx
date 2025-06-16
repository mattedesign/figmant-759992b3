
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';

interface AnalysisListSidebarProps {
  selectedAnalysis: any;
  onAnalysisSelect: (analysis: any) => void;
}

export const AnalysisListSidebar: React.FC<AnalysisListSidebarProps> = ({
  selectedAnalysis,
  onAnalysisSelect
}) => {
  const { data: analyses = [], isLoading } = useDesignAnalyses();

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Design Analysis</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Current Analysis */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-2">Current Analysis</div>
        {selectedAnalysis ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium">Analysis Name</div>
            <div className="text-sm text-gray-600">General Synopsis of analysis goes here</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No analysis selected</div>
        )}
      </div>

      {/* Recent Analyses */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="text-sm font-medium text-gray-500 mb-3">Recent</div>
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading analyses...</div>
            ) : analyses.length === 0 ? (
              <div className="text-sm text-gray-500">No analyses found</div>
            ) : (
              analyses.map((analysis) => (
                <Button
                  key={analysis.id}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto flex-col items-start"
                  onClick={() => onAnalysisSelect(analysis)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-sm">Analysis Name</div>
                      <div className="text-xs text-gray-500">3 Files</div>
                    </div>
                    <div className="text-xs text-gray-400">→</div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Saved Analyses */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 text-gray-400">⭐</div>
            <div className="text-sm font-medium text-gray-500">Saved</div>
          </div>
          <div className="space-y-2">
            {analyses.slice(0, 3).map((analysis) => (
              <Button
                key={`saved-${analysis.id}`}
                variant="ghost"
                className="w-full justify-start p-3 h-auto flex-col items-start"
                onClick={() => onAnalysisSelect(analysis)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-sm">Analysis Name</div>
                    <div className="text-xs text-gray-500">3 Files</div>
                  </div>
                  <div className="text-xs text-gray-400">→</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
