
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileText, Star } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AnalysisDetailsPanelProps {
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
}

export const AnalysisDetailsPanel: React.FC<AnalysisDetailsPanelProps> = ({
  currentAnalysis,
  attachments = [],
  onAnalysisClick,
  onBackClick
}) => {
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">Analysis Details</h3>
          {onBackClick && (
            <Button variant="ghost" size="sm" onClick={onBackClick}>
              Back
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {currentAnalysis ? (
          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={onAnalysisClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {currentAnalysis.title || 'Current Analysis'}
                  </CardTitle>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Files:</span>
                    <span className="font-medium">{attachments.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="default" className="text-xs">
                      {currentAnalysis.status || 'In Progress'}
                    </Badge>
                  </div>
                  {currentAnalysis.score && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="font-medium">{currentAnalysis.score}/10</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Attachments</h4>
                <div className="space-y-1">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="flex-1 truncate">{attachment.name}</span>
                      <Badge 
                        variant={attachment.status === 'uploaded' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {attachment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No analysis in progress</p>
          </div>
        )}
      </div>
    </div>
  );
};
