
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCompetitorAnalysis, CompetitorAnalysisData } from '@/hooks/useCompetitorAnalysis';
import { ScreenshotServiceStatus } from './ScreenshotServiceStatus';
import { FigmantPromptTemplate } from '@/types/figmant';
import { Globe, Plus, X, Play, Loader2 } from 'lucide-react';

interface CompetitorAnalysisPanelProps {
  onAnalysisComplete?: (results: CompetitorAnalysisData[]) => void;
  selectedTemplate?: FigmantPromptTemplate | null;
  templateContext?: Record<string, any>;
}

export const CompetitorAnalysisPanel: React.FC<CompetitorAnalysisPanelProps> = ({
  onAnalysisComplete,
  selectedTemplate,
  templateContext = {}
}) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [analysisGoals, setAnalysisGoals] = useState('');
  const [results, setResults] = useState<CompetitorAnalysisData[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const {
    analyzeMultipleCompetitors,
    isProcessing,
    analysisData
  } = useCompetitorAnalysis();

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length > 0 ? newUrls : ['']);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAnalyze = async () => {
    const validUrls = urls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) return;

    try {
      setError(null);
      
      // Create enhanced analysis goals that include template context
      let enhancedGoals = analysisGoals;
      
      if (selectedTemplate) {
        enhancedGoals = `Template: ${selectedTemplate.displayName}\n\n`;
        
        if (Object.keys(templateContext).length > 0) {
          enhancedGoals += 'Analysis Context:\n';
          Object.entries(templateContext).forEach(([key, value]) => {
            enhancedGoals += `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}\n`;
          });
          enhancedGoals += '\n';
        }
        
        enhancedGoals += `Focus Areas: ${selectedTemplate.analysis_focus?.join(', ') || 'General analysis'}\n\n`;
        
        if (analysisGoals) {
          enhancedGoals += `Additional Goals: ${analysisGoals}`;
        }
      }

      const analysisResults = await analyzeMultipleCompetitors(validUrls);
      setResults(analysisResults);
      onAnalysisComplete?.(analysisResults);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validUrls = urls.filter(url => url.trim() !== '' && isValidUrl(url.trim()));
  const canAnalyze = validUrls.length > 0 && !isProcessing;

  return (
    <div className="space-y-6">
      {/* Service Status */}
      <ScreenshotServiceStatus />

      {/* Template Info */}
      {selectedTemplate && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              Selected Template: {selectedTemplate.displayName}
            </CardTitle>
            <CardDescription className="text-sm">
              {selectedTemplate.description}
            </CardDescription>
          </CardHeader>
          {selectedTemplate.analysis_focus && selectedTemplate.analysis_focus.length > 0 && (
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.analysis_focus.map((focus, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {focus}
                  </Badge>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* URL Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Competitor Websites</CardTitle>
          <CardDescription>
            Enter the URLs of competitor websites you want to analyze (3-7 recommended)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://competitor-website.com"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  className={url.trim() && !isValidUrl(url.trim()) ? 'border-red-300' : ''}
                />
              </div>
              {urls.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeUrlField(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addUrlField}
              disabled={urls.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add URL
            </Button>
            <span className="text-xs text-gray-500">
              {validUrls.length} valid URL{validUrls.length !== 1 ? 's' : ''} entered
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Analysis Goals</CardTitle>
          <CardDescription>
            Specify any additional objectives or questions for your competitor analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Focus on pricing strategies, identify design patterns that drive conversion, analyze mobile experience differences..."
            value={analysisGoals}
            onChange={(e) => setAnalysisGoals(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Analysis Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Competitors...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Competitor Analysis ({validUrls.length} website{validUrls.length !== 1 ? 's' : ''})
              </>
            )}
          </Button>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {!canAnalyze && !isProcessing && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {validUrls.length === 0 ? 'Enter at least one valid competitor URL to start analysis' : 'Analysis in progress...'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
