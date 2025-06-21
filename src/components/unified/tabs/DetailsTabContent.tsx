
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Brain, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Settings
} from 'lucide-react';
import { getAnalysisSummary } from '@/utils/analysisAttachments';

interface DetailsTabContentProps {
  analysis: any;
  analysisType: string;
}

export const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  analysis,
  analysisType
}) => {
  const fullAnalysis = getAnalysisSummary(analysis);

  const renderAnalysisResults = () => {
    if (analysis.analysis_results && typeof analysis.analysis_results === 'object') {
      const results = analysis.analysis_results;
      
      return (
        <div className="space-y-4">
          {results.response && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis Response
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                {results.response}
              </div>
            </div>
          )}
          
          {results.analysis && results.analysis !== results.response && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Detailed Analysis
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                {results.analysis}
              </div>
            </div>
          )}
          
          {results.summary && results.summary !== results.response && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Summary
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg text-sm leading-relaxed">
                {results.summary}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
        {fullAnalysis}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main Analysis Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Complete Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {renderAnalysisResults()}
        </CardContent>
      </Card>

      {/* Suggestions */}
      {analysis.suggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap text-green-800">
                {typeof analysis.suggestions === 'string' 
                  ? analysis.suggestions 
                  : JSON.stringify(analysis.suggestions, null, 2)
                }
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Areas */}
      {analysis.improvement_areas && analysis.improvement_areas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.improvement_areas.map((area: string, index: number) => (
                <Badge key={index} variant="outline" className="text-orange-600 border-orange-200">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Technical Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Analysis ID:</span>
                <span className="font-mono">{analysis.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span>{analysisType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confidence Score:</span>
                <span>{Math.round((analysis.confidence_score || 0.8) * 100)}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{new Date(analysis.created_at).toLocaleString()}</span>
              </div>
              {analysis.analysis_type && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Analysis Type:</span>
                  <span>{analysis.analysis_type}</span>
                </div>
              )}
              {analysis.batch_id && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Batch ID:</span>
                  <span className="font-mono">{analysis.batch_id}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Data (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Raw Analysis Data (Debug)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <details className="cursor-pointer">
              <summary className="font-medium text-sm mb-2">View Raw JSON</summary>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
