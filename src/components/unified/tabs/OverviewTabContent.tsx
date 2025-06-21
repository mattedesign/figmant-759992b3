
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Globe,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Link,
  Zap,
  CheckCircle,
  DollarSign,
  Timer
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getAnalysisSummary, getAnalyzedUrls } from '@/utils/analysisAttachments';

interface OverviewTabContentProps {
  analysis: any;
  analysisType: string;
  attachments: any[];
}

interface QuickStats {
  filesProcessed: number;
  linksAnalyzed: number;
  creditsUsed: number;
  analysisDepth: string;
  processingTime: string;
}

export const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  analysis,
  analysisType,
  attachments
}) => {
  const summary = getAnalysisSummary(analysis);
  const analyzedUrls = getAnalyzedUrls(analysis);
  const keyMetrics = analysis.impact_summary?.key_metrics;
  const isPremium = analysisType === 'premium' || analysisType === 'wizard';

  // Calculate quick stats
  const getQuickStats = (): QuickStats => {
    const linksCount = analyzedUrls.length || analysis.analysis_results?.reference_links || 0;
    const filesCount = attachments.length || analysis.analysis_results?.files_uploaded || 0;
    const credits = analysis.analysis_results?.credits_used || (isPremium ? 15 : 3);
    
    // Calculate processing time
    const createdAt = new Date(analysis.created_at);
    const processingDuration = analysis.processing_duration_ms || 45000; // Default 45 seconds
    const processingTime = `${Math.round(processingDuration / 1000)}s`;

    return {
      filesProcessed: filesCount,
      linksAnalyzed: linksCount,
      creditsUsed: credits,
      analysisDepth: isPremium ? 'Premium' : analysisType === 'batch' ? 'Advanced' : 'Standard',
      processingTime
    };
  };

  const quickStats = getQuickStats();

  // Get premium value display
  const getPremiumValue = () => {
    if (!isPremium) return null;
    const credits = quickStats.creditsUsed;
    const dollarValue = Math.round(credits * 0.20 * 100) / 100; // Rough calculation
    return `$${dollarValue}`;
  };

  // Get confidence score with progress calculation
  const getConfidenceData = () => {
    const score = analysis.confidence_score || 0.85;
    const percentage = Math.round(score * 100);
    return { score: percentage, color: percentage >= 90 ? 'green' : percentage >= 75 ? 'blue' : 'orange' };
  };

  const confidenceData = getConfidenceData();

  // Extract executive summary and recommendations
  const getExecutiveSummary = () => {
    const results = analysis.analysis_results;
    if (!results) return { summary: summary.substring(0, 300) + '...', recommendations: [] };

    // Try to extract recommendations from the response
    const response = results.response || '';
    const recommendationMatch = response.match(/(?:recommendations?|suggestions?|key findings?)[:\s]*\n?((?:[-•*]\s*[^\n]+\n?){1,5})/i);
    
    let recommendations: string[] = [];
    if (recommendationMatch) {
      recommendations = recommendationMatch[1]
        .split(/\n/)
        .filter(line => line.trim().match(/^[-•*]\s*/))
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);
    }

    // If no structured recommendations found, create some from key metrics
    if (recommendations.length === 0 && keyMetrics) {
      const metricsEntries = Object.entries(keyMetrics);
      recommendations = metricsEntries
        .slice(0, 3)
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
        .filter(rec => rec.length > 10);
    }

    return {
      summary: response.substring(0, 400) + (response.length > 400 ? '...' : ''),
      recommendations
    };
  };

  const executiveSummary = getExecutiveSummary();

  // Get business impact prediction
  const getBusinessImpact = () => {
    if (analysis.impact_summary?.business_impact) {
      return analysis.impact_summary.business_impact;
    }
    
    // Generate a basic impact prediction based on confidence and type
    const confidence = confidenceData.score;
    if (confidence >= 90) {
      return "High potential for significant conversion rate improvements and user engagement gains.";
    } else if (confidence >= 75) {
      return "Moderate potential for measurable improvements in key performance metrics.";
    } else {
      return "Implementation recommended with careful monitoring of key metrics.";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Premium Analysis Summary Card */}
      <Card className={`${isPremium ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' : 'border-gray-200'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isPremium ? 'bg-purple-100' : 'bg-blue-100'} shadow-sm`}>
                {isPremium ? (
                  <Sparkles className="h-6 w-6 text-purple-600" />
                ) : (
                  <Target className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {analysis.title || analysis.analysis_results?.project_name || 'Analysis Complete'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {isPremium && getPremiumValue() && (
                    <Badge variant="default" className="bg-purple-600 text-white">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {getPremiumValue()} Strategic Analysis
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {quickStats.analysisDepth} Analysis
                  </Badge>
                  <Badge variant="default" className="text-xs bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Confidence Score with Progress Ring */}
            <div className="text-center">
              <div className={`relative w-16 h-16 rounded-full border-4 border-${confidenceData.color}-200 bg-${confidenceData.color}-50 flex items-center justify-center`}>
                <div 
                  className={`absolute inset-0 rounded-full border-4 border-transparent border-t-${confidenceData.color}-500`}
                  style={{
                    transform: `rotate(${(confidenceData.score / 100) * 360}deg)`,
                    clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)'
                  }}
                />
                <span className={`text-lg font-bold text-${confidenceData.color}-700`}>
                  {confidenceData.score}%
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Confidence</div>
            </div>
          </div>
          
          {/* Completion Status */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Completed {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              Processing Time: {quickStats.processingTime}
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              {quickStats.creditsUsed} credits used
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-900">{quickStats.filesProcessed}</div>
              <div className="text-sm text-gray-500">Files Processed</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Link className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-900">{quickStats.linksAnalyzed}</div>
              <div className="text-sm text-gray-500">Links Analyzed</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-900">{quickStats.creditsUsed}</div>
              <div className="text-sm text-gray-500">Credits Used</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-900">{quickStats.analysisDepth}</div>
              <div className="text-sm text-gray-500">Analysis Depth</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Timer className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <div className="text-2xl font-bold text-gray-900">{quickStats.processingTime}</div>
              <div className="text-sm text-gray-500">Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Findings Summary */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
            <p className="text-gray-700 leading-relaxed">
              {executiveSummary.summary}
            </p>
          </div>

          {/* Recommendations */}
          {executiveSummary.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommendation Highlights</h4>
              <ul className="space-y-2">
                {executiveSummary.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Business Impact Prediction */}
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Business Impact Prediction
            </h4>
            <p className="text-blue-800 text-sm">
              {getBusinessImpact()}
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
