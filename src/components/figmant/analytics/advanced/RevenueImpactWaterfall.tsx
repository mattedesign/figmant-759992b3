
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, Activity } from 'lucide-react';
import { calculateROI } from '../../pages/dashboard/widgets/revenue-tracker/roiEngine';

interface RevenueImpactWaterfallProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const RevenueImpactWaterfall: React.FC<RevenueImpactWaterfallProps> = ({
  realData,
  onExport,
  className
}) => {
  const waterfallData = useMemo(() => {
    const designAnalyses = realData?.designAnalysis || [];
    
    // Calculate revenue impact from real recommendations
    let cumulativeRevenue = 0;
    const impactCategories = [
      { name: 'Navigation', baseImpact: 25000, color: '#3b82f6' },
      { name: 'CTA Optimization', baseImpact: 35000, color: '#10b981' },
      { name: 'Mobile UX', baseImpact: 28000, color: '#f59e0b' },
      { name: 'Accessibility', baseImpact: 15000, color: '#8b5cf6' },
      { name: 'Performance', baseImpact: 22000, color: '#ef4444' },
      { name: 'Trust Signals', baseImpact: 18000, color: '#06b6d4' }
    ];

    const waterfallSteps = impactCategories.map((category, index) => {
      // Calculate real impact if we have analyses
      let realImpact = category.baseImpact;
      if (designAnalyses.length > 0) {
        const relevantAnalyses = designAnalyses.filter(analysis => {
          const suggestions = analysis.analysis_results?.suggestions || {};
          return Object.keys(suggestions).some(key => 
            key.toLowerCase().includes(category.name.toLowerCase().split(' ')[0].toLowerCase())
          );
        });
        
        if (relevantAnalyses.length > 0) {
          const avgROI = relevantAnalyses.reduce((sum, analysis) => {
            const roi = calculateROI(analysis.analysis_results || analysis);
            return sum + roi.monthlyImpact;
          }, 0) / relevantAnalyses.length;
          
          realImpact = avgROI * 12; // Annual impact
        }
      }

      const previousCumulative = cumulativeRevenue;
      cumulativeRevenue += realImpact;
      
      return {
        category: category.name,
        impact: realImpact,
        cumulativeRevenue,
        previousCumulative,
        color: category.color,
        analysisCount: designAnalyses.filter(a => {
          const suggestions = a.analysis_results?.suggestions || {};
          return Object.keys(suggestions).some(key => 
            key.toLowerCase().includes(category.name.toLowerCase().split(' ')[0].toLowerCase())
          );
        }).length
      };
    });

    // Add baseline and total
    return [
      {
        category: 'Baseline',
        impact: 0,
        cumulativeRevenue: 0,
        previousCumulative: 0,
        color: '#64748b',
        analysisCount: 0
      },
      ...waterfallSteps,
      {
        category: 'Total Impact',
        impact: cumulativeRevenue,
        cumulativeRevenue,
        previousCumulative: 0,
        color: '#059669',
        analysisCount: designAnalyses.length
      }
    ];
  }, [realData]);

  const totalImpact = waterfallData[waterfallData.length - 1]?.cumulativeRevenue || 0;
  const highestImpactCategory = waterfallData
    .slice(1, -1)
    .reduce((max, current) => current.impact > max.impact ? current : max, waterfallData[1]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600">
              Impact: ${data.impact.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">
              Cumulative: ${data.cumulativeRevenue.toLocaleString()}
            </p>
            {data.analysisCount > 0 && (
              <p className="text-xs text-gray-600">
                Based on {data.analysisCount} analyses
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleCategoryClick = (data: any) => {
    console.log('Drilling down into category:', data.category);
    // Could navigate to detailed view of recommendations for this category
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Revenue Impact Waterfall
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              Total: ${totalImpact.toLocaleString()}
            </Badge>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Highest Impact</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {highestImpactCategory?.category}
            </div>
            <div className="text-sm text-green-700">
              ${highestImpactCategory?.impact.toLocaleString()}
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Avg per Category</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              ${Math.round(totalImpact / 6).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">
              Annual Revenue
            </div>
          </div>
        </div>

        {/* Waterfall Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="category" 
              stroke="#64748b" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Waterfall bars */}
            <Bar 
              dataKey="impact" 
              onClick={handleCategoryClick}
              cursor="pointer"
            >
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            
            {/* Cumulative line */}
            <Line 
              type="monotone" 
              dataKey="cumulativeRevenue" 
              stroke="#059669" 
              strokeWidth={3}
              dot={{ fill: '#059669', strokeWidth: 2, r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full" />
            <span>Cumulative Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span>Category Impact</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
