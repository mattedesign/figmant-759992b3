
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

interface SidebarRecentAnalysesProps {
  analysisHistory: SavedChatAnalysis[];
  onSectionChange: (section: string) => void;
}

export const SidebarRecentAnalyses: React.FC<SidebarRecentAnalysesProps> = ({
  analysisHistory,
  onSectionChange
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-1">
        {analysisHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent analyses</p>
          </div>
        ) : (
          analysisHistory.slice(0, 10).map((analysis) => (
            <div
              key={analysis.id}
              className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSectionChange('analysis')}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {analysis.analysis_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {analysis.prompt_used.length > 60 
                      ? `${analysis.prompt_used.substring(0, 60)}...` 
                      : analysis.prompt_used}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
