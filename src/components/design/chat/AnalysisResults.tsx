
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { ImpactSummary } from '../ImpactSummary';

interface AnalysisResultsProps {
  lastAnalysisResult: any;
  uploadIds?: string[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  lastAnalysisResult, 
  uploadIds = [] 
}) => {
  // Get the latest analysis for the first upload ID if available
  const { data: analyses } = useDesignAnalyses(uploadIds[0]);
  const latestAnalysis = analyses?.[0];

  if (!lastAnalysisResult) {
    return null;
  }

  const hasImpactSummary = latestAnalysis?.impact_summary;

  return (
    <div className="space-y-6">
      {/* Impact Summary Section */}
      {hasImpactSummary && (
        <ImpactSummary impactSummary={latestAnalysis.impact_summary} />
      )}

      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Analysis Complete
          </CardTitle>
          <CardDescription>
            AI-powered design analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasImpactSummary ? (
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="debug">Debug</TabsTrigger>
              </TabsList>
              <TabsContent value="analysis" className="space-y-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {lastAnalysisResult.analysis || lastAnalysisResult.response || 'No analysis available'}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Response Time: {lastAnalysisResult.debugInfo?.responseTimeMs || 0}ms
                    </span>
                  </div>
                  
                  {lastAnalysisResult.debugInfo?.tokensUsed && (
                    <div className="text-sm">
                      <Badge variant="secondary">
                        {lastAnalysisResult.debugInfo.tokensUsed} tokens used
                      </Badge>
                    </div>
                  )}
                  
                  {lastAnalysisResult.debugInfo?.model && (
                    <div className="text-sm">
                      Model: <Badge variant="outline">{lastAnalysisResult.debugInfo.model}</Badge>
                    </div>
                  )}
                  
                  {uploadIds.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Upload IDs:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {uploadIds.map((id) => (
                          <Badge key={id} variant="outline" className="text-xs">
                            {id.slice(-8)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="debug" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(lastAnalysisResult.debugInfo, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {lastAnalysisResult.analysis || lastAnalysisResult.response || 'No analysis available'}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Response Time: {lastAnalysisResult.debugInfo?.responseTimeMs || 0}ms</span>
                </div>
                
                {lastAnalysisResult.debugInfo?.tokensUsed && (
                  <Badge variant="secondary">
                    {lastAnalysisResult.debugInfo.tokensUsed} tokens used
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
