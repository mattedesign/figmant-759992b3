
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Lightbulb } from 'lucide-react';

export const AnalyticsTabsList: React.FC = () => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Trends
      </TabsTrigger>
      <TabsTrigger value="activity" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Activity
      </TabsTrigger>
      <TabsTrigger value="insights" className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Insights
      </TabsTrigger>
      <TabsTrigger value="performance" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Performance
      </TabsTrigger>
    </TabsList>
  );
};
