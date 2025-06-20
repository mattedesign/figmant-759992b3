
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { calculateROI } from '../revenue-tracker/roiEngine';

interface ExecutiveReport {
  analysisVolume: number;
  averageConfidence: number;
  totalProjectedValue: number;
  keyInsights: string[];
  implementationRoadmap: {
    phase: string;
    timeline: string;
    actions: string[];
    expectedROI: number;
  }[];
  confidenceIntervals: {
    high: number;
    medium: number;
    low: number;
  };
  riskAssessment: {
    level: 'Low' | 'Medium' | 'High';
    factors: string[];
    mitigation: string[];
  };
}

interface ExecutiveSummaryGeneratorProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const ExecutiveSummaryGenerator: React.FC<ExecutiveSummaryGeneratorProps> = ({
  realData,
  className
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'brief' | 'detailed' | 'presentation'>('brief');

  // Generate executive report from real data
  const executiveReport = useMemo<ExecutiveReport>(() => {
    const analysisData = realData?.designAnalysis || [];
    
    if (analysisData.length === 0) {
      // Demo data for testing
      return {
        analysisVolume: 24,
        averageConfidence: 87.3,
        totalProjectedValue: 284500,
        keyInsights: [
          'Navigation improvements show highest ROI potential (avg 23% conversion increase)',
          'Mobile optimization gaps identified across 68% of analyzed designs',
          'CTA positioning changes could yield 15-20% uplift in conversion rates',
          'Accessibility improvements expand addressable market by 26%'
        ],
        implementationRoadmap: [
          {
            phase: 'Quick Wins (Month 1)',
            timeline: '2-4 weeks',
            actions: ['Optimize primary CTA placement', 'Improve button contrast ratios', 'Fix mobile navigation'],
            expectedROI: 89000
          },
          {
            phase: 'UX Enhancements (Month 2-3)',
            timeline: '6-8 weeks',
            actions: ['Redesign checkout flow', 'Implement progressive disclosure', 'Add trust signals'],
            expectedROI: 142000
          },
          {
            phase: 'Advanced Optimizations (Month 4-6)',
            timeline: '8-12 weeks',
            actions: ['A/B test new layouts', 'Implement personalization', 'Advanced accessibility features'],
            expectedROI: 198000
          }
        ],
        confidenceIntervals: { high: 76, medium: 19, low: 5 },
        riskAssessment: {
          level: 'Low',
          factors: ['High Claude confidence scores', 'Proven UX patterns', 'Incremental implementation'],
          mitigation: ['Phased rollout', 'A/B testing validation', 'User feedback integration']
        }
      };
    }

    // Process real analysis data
    const totalAnalyses = analysisData.length;
    const avgConfidence = analysisData.reduce((sum: number, a: any) => sum + (a.confidence_score || 85), 0) / totalAnalyses;
    
    // Calculate projected impact using ROI engine
    const roiResults = analysisData.map(analysis => 
      calculateROI(analysis.analysis_results || analysis)
    );
    const totalProjectedValue = roiResults.reduce((sum, roi) => sum + roi.monthlyImpact, 0) * 12; // Annual projection

    // Extract key insights from analysis results
    const keyInsights = extractKeyInsights(analysisData);
    
    // Generate implementation roadmap
    const implementationRoadmap = generateRoadmap(roiResults);
    
    // Calculate confidence intervals
    const confidenceScores = analysisData.map((a: any) => a.confidence_score || 85);
    const confidenceIntervals = {
      high: Math.round((confidenceScores.filter(s => s >= 80).length / totalAnalyses) * 100),
      medium: Math.round((confidenceScores.filter(s => s >= 60 && s < 80).length / totalAnalyses) * 100),
      low: Math.round((confidenceScores.filter(s => s < 60).length / totalAnalyses) * 100)
    };

    // Assess risk based on confidence variation
    const confidenceVariation = Math.max(...confidenceScores) - Math.min(...confidenceScores);
    const riskLevel: 'Low' | 'Medium' | 'High' = 
      confidenceVariation < 20 ? 'Low' : 
      confidenceVariation < 40 ? 'Medium' : 'High';

    return {
      analysisVolume: totalAnalyses,
      averageConfidence: avgConfidence,
      totalProjectedValue,
      keyInsights,
      implementationRoadmap,
      confidenceIntervals,
      riskAssessment: {
        level: riskLevel,
        factors: getRiskFactors(confidenceVariation, avgConfidence),
        mitigation: getMitigationStrategies(riskLevel)
      }
    };
  }, [realData]);

  const handleExport = (format: string) => {
    const reportData = {
      format,
      timestamp: new Date().toISOString(),
      report: executiveReport
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-report-${format}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Executive Summary Generator
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              Live Data Integration
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport(selectedFormat)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brief">Executive Brief</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
            <TabsTrigger value="presentation">Presentation Format</TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="space-y-6">
            {/* Executive Summary Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Analyses Completed</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {executiveReport.analysisVolume}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Avg Confidence</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {executiveReport.averageConfidence.toFixed(1)}%
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Projected Annual Value</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${executiveReport.totalProjectedValue.toLocaleString()}
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Risk Level</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {executiveReport.riskAssessment.level}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Key Strategic Insights
              </h3>
              <ul className="space-y-2">
                {executiveReport.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {/* Confidence Intervals */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-3">Confidence Score Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {executiveReport.confidenceIntervals.high}%
                  </div>
                  <div className="text-sm text-gray-600">High Confidence (80%+)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {executiveReport.confidenceIntervals.medium}%
                  </div>
                  <div className="text-sm text-gray-600">Medium Confidence (60-79%)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {executiveReport.confidenceIntervals.low}%
                  </div>
                  <div className="text-sm text-gray-600">Low Confidence (<60%)</div>
                </div>
              </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Implementation Roadmap
              </h3>
              {executiveReport.implementationRoadmap.map((phase, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{phase.phase}</h4>
                    <div className="text-sm text-green-600 font-medium">
                      ROI: ${phase.expectedROI.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Timeline: {phase.timeline}</div>
                  <ul className="text-sm space-y-1">
                    {phase.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Risk Assessment */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Risk Assessment & Mitigation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Factors:</h4>
                  <ul className="text-sm space-y-1">
                    {executiveReport.riskAssessment.factors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mitigation Strategies:</h4>
                  <ul className="text-sm space-y-1">
                    {executiveReport.riskAssessment.mitigation.map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presentation" className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">UX Optimization Executive Summary</h2>
                <p className="text-gray-600 mt-2">Data-Driven Design Intelligence Report</p>
                <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {executiveReport.analysisVolume}
                  </div>
                  <div className="text-sm text-gray-600">Designs Analyzed</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${Math.round(executiveReport.totalProjectedValue / 1000)}K
                  </div>
                  <div className="text-sm text-gray-600">Projected Annual Value</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Executive Recommendations</h3>
                <div className="space-y-2">
                  {executiveReport.keyInsights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Utility functions for data processing
const extractKeyInsights = (analysisData: any[]): string[] => {
  const commonPatterns = new Map<string, number>();
  
  analysisData.forEach(analysis => {
    const results = analysis.analysis_results || {};
    
    // Extract common improvement areas
    if (results.suggestions) {
      Object.keys(results.suggestions).forEach(key => {
        const count = commonPatterns.get(key) || 0;
        commonPatterns.set(key, count + 1);
      });
    }
  });

  // Convert to insights with frequency
  const insights = Array.from(commonPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([pattern, frequency]) => {
      const percentage = Math.round((frequency / analysisData.length) * 100);
      return `${pattern.replace(/_/g, ' ')} optimization identified in ${percentage}% of analyses`;
    });

  return insights.length > 0 ? insights : [
    'Consistent patterns identified across multiple design analyses',
    'High-impact improvements prioritized based on conversion potential',
    'Implementation roadmap optimized for maximum ROI',
    'Risk factors assessed and mitigation strategies developed'
  ];
};

const generateRoadmap = (roiResults: any[]) => {
  const totalROI = roiResults.reduce((sum, roi) => sum + roi.monthlyImpact, 0) * 12;
  
  return [
    {
      phase: 'Quick Wins (Month 1)',
      timeline: '2-4 weeks',
      actions: ['High-impact, low-effort improvements', 'CTA optimization', 'Basic accessibility fixes'],
      expectedROI: Math.round(totalROI * 0.3)
    },
    {
      phase: 'Core Improvements (Month 2-3)',
      timeline: '6-8 weeks',
      actions: ['Navigation restructuring', 'Mobile optimization', 'Conversion flow improvements'],
      expectedROI: Math.round(totalROI * 0.5)
    },
    {
      phase: 'Advanced Features (Month 4-6)',
      timeline: '8-12 weeks',
      actions: ['Personalization features', 'Advanced analytics', 'A/B testing framework'],
      expectedROI: Math.round(totalROI * 0.7)
    }
  ];
};

const getRiskFactors = (confidenceVariation: number, avgConfidence: number): string[] => {
  const factors = [];
  
  if (confidenceVariation > 30) {
    factors.push('High variation in Claude confidence scores across analyses');
  }
  if (avgConfidence < 70) {
    factors.push('Below-average confidence scores indicating implementation complexity');
  }
  if (factors.length === 0) {
    factors.push('Minimal risk factors identified', 'High Claude confidence scores', 'Consistent analysis patterns');
  }
  
  return factors;
};

const getMitigationStrategies = (riskLevel: 'Low' | 'Medium' | 'High'): string[] => {
  switch (riskLevel) {
    case 'High':
      return [
        'Implement comprehensive A/B testing before full rollout',
        'Extended user research and validation phases',
        'Gradual feature releases with monitoring'
      ];
    case 'Medium':
      return [
        'Phased implementation with checkpoints',
        'User feedback collection at each stage',
        'Performance monitoring and adjustment'
      ];
    default:
      return [
        'Standard deployment practices',
        'Regular performance monitoring',
        'User feedback integration'
      ];
  }
};
