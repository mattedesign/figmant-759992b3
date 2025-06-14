
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImpactSummary } from '@/hooks/batch-upload/impactSummaryGenerator';
import { BarChart3, Target } from 'lucide-react';

interface ImpactMetricsChartProps {
  impactSummary: ImpactSummary;
}

export const ImpactMetricsChart: React.FC<ImpactMetricsChartProps> = ({ impactSummary }) => {
  // Prepare data for bar chart
  const barData = [
    {
      name: 'Conversion',
      value: impactSummary.business_impact.conversion_potential,
      category: 'Business'
    },
    {
      name: 'Engagement',
      value: impactSummary.business_impact.user_engagement_score,
      category: 'Business'
    },
    {
      name: 'Brand Alignment',
      value: impactSummary.business_impact.brand_alignment,
      category: 'Business'
    },
    {
      name: 'Usability',
      value: impactSummary.user_experience.usability_score,
      category: 'UX'
    },
    {
      name: 'Accessibility',
      value: impactSummary.user_experience.accessibility_rating,
      category: 'UX'
    },
    {
      name: 'Overall',
      value: impactSummary.key_metrics.overall_score,
      category: 'Overall'
    }
  ];

  // Prepare data for radar chart
  const radarData = [
    {
      metric: 'Conversion',
      score: impactSummary.business_impact.conversion_potential,
      fullMark: 10
    },
    {
      metric: 'Engagement',
      score: impactSummary.business_impact.user_engagement_score,
      fullMark: 10
    },
    {
      metric: 'Brand',
      score: impactSummary.business_impact.brand_alignment,
      fullMark: 10
    },
    {
      metric: 'Usability',
      score: impactSummary.user_experience.usability_score,
      fullMark: 10
    },
    {
      metric: 'Accessibility',
      score: impactSummary.user_experience.accessibility_rating,
      fullMark: 10
    }
  ];

  const getBarColor = (value: number) => {
    if (value >= 8) return '#10b981'; // green-500
    if (value >= 6) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm" style={{ color: data.color }}>
            Score: {data.value}/10
          </p>
          <p className="text-xs text-muted-foreground">
            Category: {data.payload.category}
          </p>
        </div>
      );
    }
    return null;
  };

  const RadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.payload.metric}</p>
          <p className="text-sm text-blue-600">
            Score: {data.value}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="bar" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="bar" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Bar Chart
        </TabsTrigger>
        <TabsTrigger value="radar" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Radar Chart
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  domain={[0, 10]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  strokeWidth={1}
                  stroke="#6366f1"
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="radar" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comprehensive Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#6366f1' }}
                />
                <Tooltip content={<RadarTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
