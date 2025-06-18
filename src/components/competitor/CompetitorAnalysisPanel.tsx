
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Globe, 
  Camera, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Plus, 
  Trash2,
  Monitor,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { useCompetitorAnalysis, CompetitorAnalysisData } from '@/hooks/useCompetitorAnalysis';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CompetitorAnalysisPanelProps {
  onAnalysisComplete?: (results: CompetitorAnalysisData[]) => void;
}

export const CompetitorAnalysisPanel: React.FC<CompetitorAnalysisPanelProps> = ({
  onAnalysisComplete
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [urlList, setUrlList] = useState<string[]>([]);
  
  const {
    analysisData,
    isProcessing,
    analyzeMultipleCompetitors,
    clearAnalysis,
    removeCompetitor
  } = useCompetitorAnalysis();

  const addURL = () => {
    const trimmedUrl = urlInput.trim();
    if (trimmedUrl && !urlList.includes(trimmedUrl)) {
      setUrlList(prev => [...prev, trimmedUrl]);
      setUrlInput('');
    }
  };

  const removeURL = (url: string) => {
    setUrlList(prev => prev.filter(u => u !== url));
  };

  const startAnalysis = async () => {
    if (urlList.length === 0) return;
    
    try {
      const results = await analyzeMultipleCompetitors(urlList);
      onAnalysisComplete?.(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const getStatusIcon = (status: CompetitorAnalysisData['status']) => {
    switch (status) {
      case 'pending':
        return <Globe className="h-4 w-4 text-gray-400" />;
      case 'validating':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'capturing':
        return <Camera className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: CompetitorAnalysisData['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'validating':
        return 'Validating URL...';
      case 'capturing':
        return 'Capturing Screenshots...';
      case 'completed':
        return 'Analysis Complete';
      case 'failed':
        return 'Analysis Failed';
    }
  };

  const calculateProgress = () => {
    if (analysisData.length === 0) return 0;
    const completed = analysisData.filter(item => 
      item.status === 'completed' || item.status === 'failed'
    ).length;
    return (completed / analysisData.length) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Competitor Analysis - Market Positioning
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* URL Input Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://competitor-website.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addURL()}
            />
            <Button onClick={addURL} disabled={!urlInput.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* URL List */}
          {urlList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Competitors to Analyze ({urlList.length})</h4>
              <div className="space-y-2">
                {urlList.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm truncate flex-1">{url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeURL(url)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={startAnalysis} 
            disabled={urlList.length === 0 || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
          
          {analysisData.length > 0 && (
            <Button variant="outline" onClick={clearAnalysis}>
              Clear Results
            </Button>
          )}
        </div>

        {/* Progress Section */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Analysis Progress</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}

        {/* Results Section */}
        {analysisData.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Analysis Results</h4>
            <div className="space-y-3">
              {analysisData.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="font-medium text-sm">{item.validation.hostname}</span>
                        <Badge variant={item.status === 'completed' ? 'default' : 
                                     item.status === 'failed' ? 'destructive' : 'secondary'}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompetitor(item.url)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Validation Warnings */}
                    {item.validation.warnings && item.validation.warnings.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {item.validation.warnings[0]}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Error Display */}
                    {item.error && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {item.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Screenshots */}
                    {item.screenshots && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-3 w-3" />
                            <span className="text-xs font-medium">Desktop</span>
                            {item.screenshots.desktop?.success && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                          {item.screenshots.desktop?.thumbnailUrl && (
                            <div className="bg-gray-100 rounded p-2 text-center">
                              <div className="text-xs text-gray-600">Screenshot Captured</div>
                              <div className="text-xs text-gray-500">
                                {item.screenshots.desktop.metadata?.width}x{item.screenshots.desktop.metadata?.height}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-3 w-3" />
                            <span className="text-xs font-medium">Mobile</span>
                            {item.screenshots.mobile?.success && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                          {item.screenshots.mobile?.thumbnailUrl && (
                            <div className="bg-gray-100 rounded p-2 text-center">
                              <div className="text-xs text-gray-600">Screenshot Captured</div>
                              <div className="text-xs text-gray-500">
                                {item.screenshots.mobile.metadata?.width}x{item.screenshots.mobile.metadata?.height}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    {item.validation.metadata && (
                      <div className="text-xs text-gray-600 space-y-1">
                        {item.validation.metadata.loadTime && (
                          <div>Load time: {item.validation.metadata.loadTime}ms</div>
                        )}
                        <div className="truncate">URL: {item.url}</div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
