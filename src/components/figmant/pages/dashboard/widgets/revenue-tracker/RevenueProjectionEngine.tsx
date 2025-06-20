
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calculator, BarChart3, Target, Activity, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { calculateROI, calculateTrendAnalysis, ROIProjection, TrendAnalysis } from './roiEngine';

interface RevenueProjectionEngineProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const RevenueProjectionEngine: React.FC<RevenueProjectionEngineProps> = ({
  realData,
  className
}) => {
  // Calculate comprehensive ROI and trend analysis from real data
  const { roiProjections, trendAnalysis, aggregateMetrics } = useMemo(() => {
    const designAnalyses = realData?.designAnalysis || [];
    
    if (designAnalyses.length === 0) {
      // Fallback demo data
      const demoROI = calculateROI({
        suggestions: {
          navigation: 'Improve menu clarity',
          cta: 'Optimize button placement',
          mobile: 'Enhance responsive design'
        },
        confidence_score: 87
      });
      
      return {
        roiProjections: [demoROI],
        trendAnalysis: {
          analysisFrequency: { daily: 2, weekly: 14, monthly: 60 },
          confidenceCorrelation: { avgConfidence: 87, projectedImpact: 12400, correlation: 0.72 },
          improvementTrends: [
            { period: 'Week 1', improvement: 11200, confidence: 84 },
            { period: 'Week 2', improvement: 11800, confidence: 86 },
            { period: 'Week 3', improvement: 12100, confidence: 87 },
            { period: 'Week 4', improvement: 12400, confidence: 87 }
          ],
          valuableAnalysisTypes: [
            { type: 'conversion_optimization', avgROI: 14500, frequency: 8, avgConfidence: 89 },
            { type: 'user_experience', avgROI: 12200, frequency: 12, avgConfidence: 85 },
            { type: 'mobile_optimization', avgROI: 10800, frequency: 6, avgConfidence: 82 }
          ]
        },
        aggregateMetrics: {
          totalMonthlyImpact: demoROI.monthlyImpact,
          totalYearlyProjection: demoROI.yearlyProjection,
          avgPaybackPeriod: demoROI.paybackPeriod,
          avgConfidence: 87
        }
      };
    }
    
    // Process real data
    const roiProjections = designAnalyses.map(analysis => 
      calculateROI(analysis.analysis_results || analysis)
    );
    
    const trendAnalysis = calculateTrendAnalysis(designAnalyses);
    
    const aggregateMetrics = {
      totalMonthlyImpact: roiProjections.reduce((sum, roi) => sum + roi.monthlyImpact, 0),
      totalYearlyProjection: roiProjections.reduce((sum, roi) => sum + roi.yearlyProjection, 0),
      avgPaybackPeriod: roiProjections.reduce((sum, roi) => sum + roi.paybackPeriod, 0) / roiProjections.length,
      avgConfidence: roiProjections.reduce((sum, roi) => sum + roi.confidenceLevel, 0) / roiProjections.length
    };
    
    return { roiProjections, trendAnalysis, aggregateMetrics };
  }, [realData]);

  // Chart colors
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Revenue Projection Engine
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800">
            Live ROI Analysis
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="projections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projections">ROI Projections</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="valuable">Top Types</TabsTrigger>
          </TabsList>

          <TabsContent value="projections" className="space-y-6">
            {/* Aggregate Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Monthly Impact</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${aggregateMetrics.totalMonthlyImpact.toLocaleString()}
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Yearly Projection</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${aggregateMetrics.totalYearlyProjection.toLocaleString()}
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Avg Confidence</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {aggregateMetrics.avgConfidence.toFixed(0)}%
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Payback Period</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {aggregateMetrics.avgPaybackPeriod.toFixed(1)} months
                </div>
              </div>
            </div>

            {/* ROI Breakdown Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">ROI Breakdown by Industry</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiProjections.slice(0, 6)}>
                    <XAxis dataKey="industryType" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Monthly Impact']}
                    />
                    <Bar dataKey="monthlyImpact" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Confidence Correlation */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Confidence vs Impact Correlation</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Avg Confidence:</span>
                  <div className="text-lg font-bold text-blue-900">
                    {trendAnalysis.confidenceCorrelation.avgConfidence.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Projected Impact:</span>
                  <div className="text-lg font-bold text-blue-900">
                    ${trendAnalysis.confidenceCorrelation.projectedImpact.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Correlation:</span>
                  <div className="text-lg font-bold text-blue-900">
                    {(trendAnalysis.confidenceCorrelation.correlation * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Trends Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Improvement Trends Over Time</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendAnalysis.improvementTrends}>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'improvement' ? `$${Number(value).toLocaleString()}` : `${Number(value).toFixed(1)}%`,
                        name === 'improvement' ? 'Revenue Impact' : 'Confidence'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="improvement" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="frequency" className="space-y-6">
            {/* Analysis Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {trendAnalysis.analysisFrequency.daily}
                </div>
                <div className="text-sm text-green-700">Daily Analyses</div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {trendAnalysis.analysisFrequency.weekly}
                </div>
                <div className="text-sm text-blue-700">Weekly Analyses</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {trendAnalysis.analysisFrequency.monthly}
                </div>
                <div className="text-sm text-purple-700">Monthly Analyses</div>
              </div>
            </div>

            {/* Frequency Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Analysis Pattern Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Daily', value: trendAnalysis.analysisFrequency.daily },
                        { name: 'Weekly', value: trendAnalysis.analysisFrequency.weekly },
                        { name: 'Monthly', value: trendAnalysis.analysisFrequency.monthly }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {chartColors.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="valuable" className="space-y-6">
            {/* Most Valuable Analysis Types */}
            <div className="space-y-3">
              <h4 className="font-semibold">Most Valuable Analysis Types</h4>
              {trendAnalysis.valuableAnalysisTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {type.type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {type.frequency} analyses • {type.avgConfidence}% avg confidence
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${type.avgROI.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg ROI/month
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ROI Distribution Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">ROI Distribution by Analysis Type</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendAnalysis.valuableAnalysisTypes.slice(0, 5)} layout="horizontal">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={100} />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg ROI']}
                    />
                    <Bar dataKey="avgROI" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
