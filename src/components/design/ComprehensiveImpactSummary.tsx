
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Star, 
  AlertTriangle, 
  Image as ImageIcon,
  BarChart3,
  Eye,
  MessageSquare,
  Smartphone,
  Shield,
  Layers,
  Calendar,
  Zap
} from 'lucide-react';
import { CompleteAnalysisScore } from '@/types/comprehensiveScoring';
import { ComprehensiveScoringService } from '@/services/comprehensiveScoringService';
import { DesignScreenshot } from './DesignScreenshot';

interface ComprehensiveImpactSummaryProps {
  analysisData: any;
  designImageUrl?: string;
  designFileName?: string;
  winnerUploadId?: string;
  className?: string;
}

export const ComprehensiveImpactSummary: React.FC<ComprehensiveImpactSummaryProps> = ({ 
  analysisData,
  designImageUrl,
  designFileName,
  winnerUploadId,
  className = '' 
}) => {
  // Generate comprehensive scoring
  const comprehensiveScore = ComprehensiveScoringService.generateCompleteScore(
    analysisData,
    analysisData?.analysis_type || 'general'
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Comprehensive Design Intelligence Platform
        </CardTitle>
        <CardDescription>
          Complete analysis across all 10 use cases with unified scoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Platform Overview Score */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className="h-8 w-8 text-yellow-500" />
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {comprehensiveScore.overallPlatformScore}/1000
            </span>
          </div>
          <p className="text-lg font-medium mb-2">Overall Platform Score</p>
          <Progress 
            value={comprehensiveScore.overallPlatformScore / 10} 
            className="w-48 mx-auto"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Platform Maturity: {comprehensiveScore.platformIntelligence.overallDesignMaturity}/100
          </p>
        </div>

        {/* Design Screenshot Section */}
        {(designImageUrl || winnerUploadId) && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Design Analysis
            </h4>
            <DesignScreenshot
              imageUrl={designImageUrl}
              fileName={designFileName}
              uploadId={winnerUploadId}
              overallScore={Math.round(comprehensiveScore.overallPlatformScore / 100)}
            />
          </div>
        )}

        {/* Comprehensive Use Case Analysis */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Business Impact</span>
                  <Badge variant={getScoreBadgeVariant(comprehensiveScore.platformIntelligence.businessImpactPotential)}>
                    {comprehensiveScore.platformIntelligence.businessImpactPotential}/100
                  </Badge>
                </div>
                <Progress value={comprehensiveScore.platformIntelligence.businessImpactPotential} className="h-2" />
              </div>
              
              <div className="space-y-3 p-4 bg-green-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Design Maturity</span>
                  <Badge variant={getScoreBadgeVariant(comprehensiveScore.platformIntelligence.overallDesignMaturity)}>
                    {comprehensiveScore.platformIntelligence.overallDesignMaturity}/100
                  </Badge>
                </div>
                <Progress value={comprehensiveScore.platformIntelligence.overallDesignMaturity} className="h-2" />
              </div>
              
              <div className="space-y-3 p-4 bg-purple-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">ROI Potential</span>
                  <Badge variant="default">
                    ${comprehensiveScore.platformIntelligence.platformROIProjection.potentialValue.toLocaleString()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Time to Value: {comprehensiveScore.platformIntelligence.platformROIProjection.timeToValue} months
                </div>
              </div>
            </div>

            {/* Priority Action Matrix */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Priority Action Matrix
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800 mb-2">High Impact, Low Effort</h5>
                  {comprehensiveScore.platformIntelligence.implementationPriority.highImpactLowEffort.map((item, index) => (
                    <div key={index} className="text-sm mb-1">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-green-600 ml-2">ROI: {item.roi}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-800 mb-2">High Impact, High Effort</h5>
                  {comprehensiveScore.platformIntelligence.implementationPriority.highImpactHighEffort.map((item, index) => (
                    <div key={index} className="text-sm mb-1">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-blue-600 ml-2">Timeline: {item.timeline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            {/* Visual Design Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="h-4 w-4" />
                    Visual Hierarchy & Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Hierarchy Effectiveness</span>
                    <span className={getScoreColor(comprehensiveScore.visualDesignAnalysis.hierarchyEffectivenessScore)}>
                      {comprehensiveScore.visualDesignAnalysis.hierarchyEffectivenessScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Eye Tracking Simulation</span>
                    <span className={getScoreColor(comprehensiveScore.visualDesignAnalysis.eyeTrackingSimulationScore)}>
                      {comprehensiveScore.visualDesignAnalysis.eyeTrackingSimulationScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Readability Score</span>
                    <span className={getScoreColor(comprehensiveScore.visualDesignAnalysis.readabilityScore)}>
                      {comprehensiveScore.visualDesignAnalysis.readabilityScore}/100
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4" />
                    Messaging Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Headline Effectiveness</span>
                    <span className={getScoreColor(comprehensiveScore.messagingAnalysis.headlineEffectivenessScore)}>
                      {comprehensiveScore.messagingAnalysis.headlineEffectivenessScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CTA Optimization</span>
                    <span className={getScoreColor(comprehensiveScore.messagingAnalysis.ctaOptimizationScore)}>
                      {comprehensiveScore.messagingAnalysis.ctaOptimizationScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Value Proposition</span>
                    <span className={getScoreColor(comprehensiveScore.messagingAnalysis.valuePropositionScore)}>
                      {comprehensiveScore.messagingAnalysis.valuePropositionScore}/100
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="h-4 w-4" />
                  Cross-Device Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {comprehensiveScore.deviceOptimization.mobileOptimizationScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Mobile Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {comprehensiveScore.deviceOptimization.desktopOptimizationScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Desktop Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {comprehensiveScore.deviceOptimization.responsiveDesignScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Responsive Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            {/* Competitive Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4" />
                  Competitive Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Position</span>
                      <Badge variant={getScoreBadgeVariant(comprehensiveScore.competitiveAnalysis.marketPositionScore)}>
                        {comprehensiveScore.competitiveAnalysis.marketPositionScore}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Competitive Advantage</span>
                      <Badge variant={getScoreBadgeVariant(comprehensiveScore.competitiveAnalysis.competitiveAdvantageScore)}>
                        {comprehensiveScore.competitiveAnalysis.competitiveAdvantageScore}/100
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gap Analysis</span>
                      <Badge variant={getScoreBadgeVariant(comprehensiveScore.competitiveAnalysis.gapAnalysisScore)}>
                        {comprehensiveScore.competitiveAnalysis.gapAnalysisScore}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trend Alignment</span>
                      <Badge variant={getScoreBadgeVariant(comprehensiveScore.competitiveAnalysis.competitorTrendScore)}>
                        {comprehensiveScore.competitiveAnalysis.competitorTrendScore}/100
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  Revenue Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {comprehensiveScore.revenueOptimization.conversionOptimizationScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Conversion Score</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      ${comprehensiveScore.revenueOptimization.estimatedROI.projectedReturn.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Projected Return</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {comprehensiveScore.revenueOptimization.estimatedROI.timeToImpact} days
                    </div>
                    <div className="text-xs text-muted-foreground">Time to Impact</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A/B Testing Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4" />
                  A/B Testing Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Testing Readiness</span>
                    <Badge variant={getScoreBadgeVariant(comprehensiveScore.testingIntelligence.testingReadinessScore)}>
                      {comprehensiveScore.testingIntelligence.testingReadinessScore}/100
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Suggested Tests:</h5>
                    {comprehensiveScore.testingIntelligence.suggestedTests.slice(0, 2).map((test, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium">{test.testName}</div>
                        <div className="text-muted-foreground">Expected lift: {test.expectedLift.toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            {/* Accessibility Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  Accessibility & Legal Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>WCAG Compliance</span>
                      <Badge variant={getScoreBadgeVariant(comprehensiveScore.accessibilityCompliance.wcagComplianceScore)}>
                        {comprehensiveScore.accessibilityCompliance.wcagComplianceScore}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Legal Risk Score</span>
                      <Badge variant={getScoreBadgeVariant(comprehensiveScore.accessibilityCompliance.legalRiskScore)}>
                        {comprehensiveScore.accessibilityCompliance.legalRiskScore}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Compliance Level</span>
                      <Badge variant="outline">
                        {comprehensiveScore.accessibilityCompliance.complianceLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h5 className="text-sm font-medium text-yellow-800 mb-2">Risk Assessment</h5>
                    <div className="text-xs text-yellow-700">
                      <div>Risk Level: {comprehensiveScore.accessibilityCompliance.legalRiskAssessment.riskLevel}</div>
                      <div>Est. Compliance Cost: ${comprehensiveScore.accessibilityCompliance.legalRiskAssessment.estimatedCost.toLocaleString()}</div>
                      <div>Timeline: {comprehensiveScore.accessibilityCompliance.legalRiskAssessment.timelineToComply} days</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers className="h-4 w-4" />
                  Design System Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {comprehensiveScore.designSystemHealth.componentConsistencyScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Component Consistency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {comprehensiveScore.designSystemHealth.systemAdoptionScore}
                    </div>
                    <div className="text-xs text-muted-foreground">System Adoption</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {comprehensiveScore.designSystemHealth.systemROIScore}
                    </div>
                    <div className="text-xs text-muted-foreground">System ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Seasonal Campaign Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Seasonal Readiness</span>
                    <Badge variant={getScoreBadgeVariant(comprehensiveScore.campaignIntelligence.seasonalReadinessScore)}>
                      {comprehensiveScore.campaignIntelligence.seasonalReadinessScore}/100
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Upcoming Opportunities:</h5>
                    {comprehensiveScore.campaignIntelligence.seasonalRecommendations.slice(0, 2).map((strategy, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium">{strategy.season}</div>
                        <div className="text-muted-foreground">{strategy.opportunity}</div>
                        <div className="text-blue-600">Expected Impact: {strategy.expectedImpact}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Cross-Platform Opportunities */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Cross-Platform Opportunities
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-800 mb-2">Integration Opportunities</h5>
              <ul className="space-y-1">
                {comprehensiveScore.platformIntelligence.crossUseCaseOpportunities.integrationNeeds.slice(0, 3).map((need, index) => (
                  <li key={index} className="text-sm text-blue-700">• {need}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-800 mb-2">Feature Expansion</h5>
              <ul className="space-y-1">
                {comprehensiveScore.platformIntelligence.crossUseCaseOpportunities.featureGaps.slice(0, 3).map((gap, index) => (
                  <li key={index} className="text-sm text-green-700">• {gap}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
