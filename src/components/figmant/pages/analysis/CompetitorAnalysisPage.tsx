
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompetitorAnalysisPanel } from '@/components/competitor/CompetitorAnalysisPanel';
import { CompetitorAnalysisData } from '@/hooks/useCompetitorAnalysis';
import { useIsMobile } from '@/hooks/use-mobile';
import { Target } from 'lucide-react';

export const CompetitorAnalysisPage: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<CompetitorAnalysisData[]>([]);
  const isMobile = useIsMobile();

  const handleAnalysisComplete = (results: CompetitorAnalysisData[]) => {
    setAnalysisResults(results);
    console.log('Competitor analysis completed:', results);
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-transparent flex-shrink-0 border-b border-gray-200`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
              Competitor Analysis
            </h1>
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
              Analyze competitor websites to gain market positioning insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-6`}>
          {/* Competitor Analysis Panel */}
          <CompetitorAnalysisPanel onAnalysisComplete={handleAnalysisComplete} />
          
          {/* Analysis Results */}
          {analysisResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResults.length}
                      </div>
                      <div className="text-sm text-blue-700">Competitors Analyzed</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analysisResults.filter(r => r.status === 'completed').length}
                      </div>
                      <div className="text-sm text-green-700">Successful Captures</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {analysisResults.filter(r => r.screenshots?.desktop?.success || r.screenshots?.mobile?.success).length}
                      </div>
                      <div className="text-sm text-yellow-700">Screenshots Captured</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Analysis completed successfully. Use the chat interface to get AI-powered insights about your competitors' design strategies and market positioning.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
