
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Lightbulb, TrendingUp, Target } from 'lucide-react';
import { ExtractedSuggestion } from '@/utils/suggestionExtractor';

interface AnalysisResultsProps {
  lastAnalysisResult: {
    analysis: string;
  };
  uploadIds?: string[];
  extractedSuggestions?: ExtractedSuggestion[];
  showEnhancedSummary?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  lastAnalysisResult,
  uploadIds,
  extractedSuggestions = [],
  showEnhancedSummary = false
}) => {
  if (!lastAnalysisResult) {
    return null;
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Conversion':
        return Target;
      case 'Performance':
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Suggestions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {lastAnalysisResult.analysis}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-4">
            {extractedSuggestions.length > 0 ? (
              <div className="space-y-3">
                {extractedSuggestions.map((suggestion) => {
                  const IconComponent = getCategoryIcon(suggestion.category);
                  return (
                    <div key={suggestion.id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-3 w-3 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            {suggestion.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-9">
                        <Badge className={`text-xs px-2 py-0.5 ${getImpactColor(suggestion.impact)}`}>
                          {suggestion.impact} Impact
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {suggestion.category}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No suggestions extracted yet</p>
                <p className="text-xs text-gray-400">Suggestions will appear after analysis</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
