
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  BarChart3, 
  FileText, 
  Image as ImageIcon,
  Clock,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface AnalysisDetailViewerProps {
  analysis: any;
  onBack: () => void;
  onShare?: (analysis: any) => void;
  onDownload?: (analysis: any) => void;
}

export const AnalysisDetailViewer: React.FC<AnalysisDetailViewerProps> = ({
  analysis,
  onBack,
  onShare,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'processing':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Processing'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          label: 'Failed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          label: 'Unknown'
        };
    }
  };

  const analysisTitle = analysis.design_upload?.file_name || 
                       analysis.batch_analysis?.name || 
                       `Analysis ${analysis.id.slice(0, 8)}`;
  
  const createdDate = analysis.created_at ? new Date(analysis.created_at) : new Date();
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  const status = analysis.status || 'completed';
  const statusConfig = getStatusConfig(status);
  const confidence = Math.round((analysis.confidence_score || 0) * 100);
  const StatusIcon = statusConfig.icon;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{confidence}%</div>
              <div className="text-sm text-gray-600">Confidence Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analysis.impact_summary?.recommendations?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Recommendations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analysis.analysis_type || 'Standard'}
              </div>
              <div className="text-sm text-gray-600">Analysis Type</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {analysis.impact_summary && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {analysis.impact_summary.summary || 'No summary available'}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Recommendations */}
      {analysis.impact_summary?.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.impact_summary.recommendations.slice(0, 3).map((rec: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {rec.title || `Recommendation ${index + 1}`}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {rec.description || 'No description available'}
                      </p>
                      {rec.impact && (
                        <Badge variant="secondary" className="mt-2">
                          {rec.impact} impact
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDetailsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Analysis ID</label>
                <p className="text-sm text-gray-900 font-mono">{analysis.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm text-gray-900">{timeAgo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-sm text-gray-900">{analysis.analysis_type || 'Standard'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={cn("text-xs", statusConfig.color)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Confidence Score</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{confidence}%</span>
                </div>
              </div>
              {analysis.design_upload && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Source File</label>
                  <p className="text-sm text-gray-900">{analysis.design_upload.file_name}</p>
                </div>
              )}
              {analysis.batch_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Batch Analysis</label>
                  <p className="text-sm text-gray-900">Part of batch analysis</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Analysis Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-96">
            {JSON.stringify(analysis.analysis_results || {}, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-6">
      {analysis.impact_summary?.recommendations ? (
        analysis.impact_summary.recommendations.map((rec: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Recommendation {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {rec.title || `Recommendation ${index + 1}`}
                  </h4>
                  <p className="text-gray-600">
                    {rec.description || 'No description available'}
                  </p>
                </div>
                
                {rec.impact && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Impact:</span>
                    <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                      {rec.impact}
                    </Badge>
                  </div>
                )}

                {rec.effort && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Effort:</span>
                    <Badge variant="outline">
                      {rec.effort}
                    </Badge>
                  </div>
                )}

                {rec.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <Badge variant="secondary">
                      {rec.category}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Recommendations Available
            </h3>
            <p className="text-gray-600">
              This analysis doesn't have specific recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-none border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {analysisTitle}
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", statusConfig.color)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onShare?.(analysis)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload?.(analysis)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="flex-none mx-6 mt-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto p-6">
            <TabsContent value="overview" className="mt-0">
              {renderOverviewTab()}
            </TabsContent>
            <TabsContent value="recommendations" className="mt-0">
              {renderRecommendationsTab()}
            </TabsContent>
            <TabsContent value="details" className="mt-0">
              {renderDetailsTab()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
