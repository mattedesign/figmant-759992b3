
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getAnalysisSummary, getAnalyzedUrls } from '@/utils/analysisAttachments';

interface OverviewTabContentProps {
  analysis: any;
  analysisType: string;
  attachments: any[];
}

export const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  analysis,
  analysisType,
  attachments
}) => {
  const summary = getAnalysisSummary(analysis);
  const analyzedUrls = getAnalyzedUrls(analysis);
  const keyMetrics = analysis.impact_summary?.key_metrics;

  const getQuickStats = () => {
    const stats = [
      {
        label: 'Created',
        value: formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true }),
        icon: Clock
      },
      {
        label: 'Confidence',
        value: `${Math.round((analysis.confidence_score || 0.8) * 100)}%`,
        icon: TrendingUp
      },
      {
        label: 'Items Analyzed',
        value: attachments.length + analyzedUrls.length || 1,
        icon: Target
      }
    ];

    if (keyMetrics?.overall_score) {
      stats.push({
        label: 'Overall Score',
        value: `${keyMetrics.overall_score}/10`,
        icon: Target
      });
    }

    return stats;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {getQuickStats().map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {summary.length > 500 ? `${summary.substring(0, 500)}...` : summary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {keyMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(keyMetrics).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {typeof value === 'number' ? 
                      (key.includes('score') ? `${value}/10` : value) : 
                      String(value)
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Overview */}
      {(attachments.length > 0 || analyzedUrls.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Content Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attachments.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Files & Images</span>
                  </div>
                  <Badge variant="secondary">{attachments.length}</Badge>
                </div>
              )}
              
              {analyzedUrls.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="font-medium">URLs Analyzed</span>
                  </div>
                  <Badge variant="secondary">{analyzedUrls.length}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Type Specific Information */}
      {analysisType === 'batch' && analysis.winner_upload_id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Batch Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-700">
                Winner identified: Upload ID {analysis.winner_upload_id}
              </div>
              {analysis.context_summary && (
                <div className="mt-2 text-sm text-gray-600">
                  {analysis.context_summary}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {analysisType === 'chat' && analysis.prompt_used && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Original Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              {analysis.prompt_used}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
