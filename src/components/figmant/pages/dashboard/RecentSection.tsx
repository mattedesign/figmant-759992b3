
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { AnalysisDetailModal } from './components/AnalysisDetailModal';

export const RecentSection: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const handleAnalysisClick = (analysis: any) => {
    console.log('Analysis clicked:', analysis);
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnalysis(null);
  };

  return (
    <>
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
              <div 
                key={`${analysis.type}-${analysis.id}`}
                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                onClick={() => handleAnalysisClick(analysis)}
              >
                <span className="text-sm text-gray-700 flex-1">
                  {analysis.displayTitle}
                </span>
              </div>
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

      <AnalysisDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        analysis={selectedAnalysis}
      />
    </>
  );
};
