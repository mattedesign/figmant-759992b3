
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImpactSummary } from '@/hooks/batch-upload/impactSummaryGenerator';
import { BarChart3, Target } from 'lucide-react';
import { MetricsBarChart } from './charts/MetricsBarChart';
import { MetricsRadarChart } from './charts/MetricsRadarChart';
import { prepareBarChartData, prepareRadarChartData } from './charts/chartDataUtils';

interface ImpactMetricsChartProps {
  impactSummary: ImpactSummary;
}

export const ImpactMetricsChart: React.FC<ImpactMetricsChartProps> = ({ impactSummary }) => {
  const barData = prepareBarChartData(impactSummary);
  const radarData = prepareRadarChartData(impactSummary);

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
        <MetricsBarChart data={barData} />
      </TabsContent>

      <TabsContent value="radar" className="mt-4">
        <MetricsRadarChart data={radarData} />
      </TabsContent>
    </Tabs>
  );
};
