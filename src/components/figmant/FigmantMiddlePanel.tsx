
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Maximize2 } from 'lucide-react';
import { useSimplifiedAnalysisData } from '@/hooks/useSimplifiedAnalysisData';
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
  const { allAnalyses, isLoading } = useSimplifiedAnalysisData();

  const renderAnalysisSection = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Design Analysis</h2>
            <Maximize2 className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white h-9">
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Current Analysis */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
              <span>Current Analysis</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="font-medium text-gray-900 mb-1">Analysis Name</h3>
              <p className="text-sm text-gray-600">General Synopsis of analysis goes here</p>
            </div>
          </div>

          {/* Recent Section */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
              <span>Recent</span>
            </div>
            
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading analyses...
                </div>
              ) : allAnalyses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No analyses found. Start by creating a new analysis.
                </div>
              ) : (
                allAnalyses.slice(0, 6).map((analysis) => (
                  <div
                    key={analysis.id}
                    onClick={() => onAnalysisSelect(analysis)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAnalysis?.id === analysis.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Analysis Name</h4>
                        <p className="text-xs text-gray-500">3 Files</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saved Section */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
              <span>Saved</span>
            </div>
            
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Analysis Name</h4>
                      <p className="text-xs text-gray-500">3 Files</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Preview at bottom */}
      <div className="border-t border-gray-200 p-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
          <p className="text-xs text-gray-500">Add an address so you can get paid</p>
        </div>
      </div>
    </div>
  );

  return renderAnalysisSection();
};
