
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { AnalysisDetailView } from '@/components/figmant/pages/analysis/AnalysisDetailView';

export const RecentSection: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const { data: designAnalyses = [] } = useDesignAnalyses();

  // Combine and sort recent analyses
  const recentAnalyses = [
    ...chatAnalyses.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: 'Chat Analysis',
      displayTitle: `Chat Analysis - ${a.analysis_type || 'General'}`
    })),
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: 'Design Analysis',
      displayTitle: `Design Analysis - ${a.analysis_type || 'General'}`
    }))
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const handleAnalysisClick = (event: React.MouseEvent, analysis: any) => {
    // Prevent any bubbling or default behavior
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Analysis clicked in RecentSection:', analysis);
    setSelectedAnalysis(analysis);
    setShowDetailView(true);
  };

  const handleBackFromDetail = () => {
    console.log('Returning from detail view');
    setShowDetailView(false);
    setSelectedAnalysis(null);
  };

  const handleAnalysisSelect = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  console.log('RecentSection render - showDetailView:', showDetailView, 'selectedAnalysis:', !!selectedAnalysis);

  // Show detail view if an analysis is selected
  if (showDetailView && selectedAnalysis) {
    return (
      <AnalysisDetailView
        selectedAnalysis={selectedAnalysis}
        onAnalysisSelect={handleAnalysisSelect}
        onBackFromDetail={handleBackFromDetail}
      />
    );
  }

  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="font-semibold">Recent</h3>
        <Button variant="ghost" size="sm" className="text-blue-600">
          <Settings className="h-4 w-4 mr-1" />
        </Button>
      </div>
      <div className="space-y-2">
        {recentAnalyses.length > 0 ? (
          recentAnalyses.map((analysis, index) => (
            <button
              key={`${analysis.type}-${analysis.id}`}
              className="w-full flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors text-left"
              onClick={(e) => handleAnalysisClick(e, analysis)}
              type="button"
            >
              <span className="text-sm text-gray-700 flex-1">
                {analysis.displayTitle}
              </span>
            </button>
          ))
        ) : (
          ["Analysis of something", "Analysis of something", "Analysis of something"].map((item, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))
        )}
        <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
          See all
        </Button>
      </div>
    </div>
  );
};
