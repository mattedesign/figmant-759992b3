
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Camera, Globe, TrendingUp, Users, Zap } from 'lucide-react';
import { CompetitorAnalysisPanel } from '@/components/competitor/CompetitorAnalysisPanel';
import { CompetitorAnalysisData } from '@/hooks/useCompetitorAnalysis';

interface CompetitorTabProps {
  widgetMetrics: any;
}

export const CompetitorTab: React.FC<CompetitorTabProps> = ({ widgetMetrics }) => {
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<CompetitorAnalysisData[]>([]);

  const handleAnalysisComplete = (results: CompetitorAnalysisData[]) => {
    setAnalysisResults(results);
    console.log('Competitor analysis completed:', results);
  };

  if (showAnalysisPanel) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Market Positioning Analysis</h3>
          <Button 
            variant="outline" 
            onClick={() => setShowAnalysisPanel(false)}
          >
            Back to Overview
          </Button>
        </div>
        
        <CompetitorAnalysisPanel 
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Competitor Analysis - Market Positioning
          </CardTitle>
          <CardDescription>
            Analyze competitor websites with automated URL validation and screenshot capture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {widgetMetrics.totalCompetitors}
              </div>
              <div className="text-sm text-gray-600">Competitors Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(widgetMetrics.averageConfidenceScore)}%
              </div>
              <div className="text-sm text-gray-600">Average Analysis Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analysisResults.length}
              </div>
              <div className="text-sm text-gray-600">Screenshots Captured</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Key Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Advanced URL validation</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-green-500" />
                <span>Automated screenshot capture</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span>Market positioning insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-orange-500" />
                <span>Competitor comparison</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => setShowAnalysisPanel(true)}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Start Competitor Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Recent Results */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResults.slice(0, 3).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <div>
                      <div className="font-medium text-sm">{result.validation.hostname}</div>
                      <div className="text-xs text-gray-600">{result.url}</div>
                    </div>
                  </div>
                  <Badge variant={result.status === 'completed' ? 'default' : 
                               result.status === 'failed' ? 'destructive' : 'secondary'}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
