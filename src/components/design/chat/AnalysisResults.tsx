
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { EnhancedImpactSummary } from '../EnhancedImpactSummary';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalysisResultsProps {
  lastAnalysisResult: any;
  uploadIds?: string[];
  showEnhancedSummary?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  lastAnalysisResult, 
  uploadIds = [],
  showEnhancedSummary = true
}) => {
  // Get the latest analysis for the first upload ID if available
  const { data: analyses } = useDesignAnalyses(uploadIds[0]);
  const latestAnalysis = analyses?.[0];

  if (!lastAnalysisResult) {
    return null;
  }

  const hasImpactSummary = latestAnalysis?.impact_summary;

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Enhanced Impact Summary Section */}
      {showEnhancedSummary && hasImpactSummary && (
        <div className="flex-shrink-0 p-4 border-b">
          <EnhancedImpactSummary 
            impactSummary={latestAnalysis.impact_summary}
            winnerUploadId={uploadIds[0]}
          />
        </div>
      )}

      {/* Analysis Results Card */}
      <div className="flex-1 min-h-0 p-4">
        <Card className="h-full flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              AI-powered design analysis insights
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 min-h-0 p-6 pt-0">
            {hasImpactSummary ? (
              <Tabs defaultValue="analysis" className="h-full flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-3 flex-shrink-0 mb-4">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="debug">Debug</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="flex-1 min-h-0 mt-0">
                  <ScrollArea className="h-full">
                    <div className="pr-4">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                        {lastAnalysisResult.analysis || lastAnalysisResult.response || 'No analysis available'}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="details" className="flex-1 min-h-0 mt-0">
                  <ScrollArea className="h-full">
                    <div className="pr-4 space-y-3">
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
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="debug" className="flex-1 min-h-0 mt-0">
                  <ScrollArea className="h-full">
                    <div className="pr-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <pre className="text-xs overflow-auto whitespace-pre-wrap">
                          {JSON.stringify(lastAnalysisResult.debugInfo, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex flex-col min-h-0">
                <ScrollArea className="flex-1">
                  <div className="pr-4">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                      {lastAnalysisResult.analysis || lastAnalysisResult.response || 'No analysis available'}
                    </div>
                  </div>
                </ScrollArea>
                
                <div className="flex-shrink-0 mt-4 pt-4 border-t">
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
