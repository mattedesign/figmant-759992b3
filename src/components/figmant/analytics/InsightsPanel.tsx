
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceSummaryCard } from './components/PerformanceSummaryCard';
import { AIRecommendationsSection } from './components/AIRecommendationsSection';
import { InsightsList } from './components/InsightsList';
import { generateRecommendations } from './utils/insightsUtils';
import { InsightsPanelProps } from './types/insights';

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  insights,
  metrics,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const recommendations = generateRecommendations(metrics);

  return (
    <div className="space-y-6">
      <PerformanceSummaryCard />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="improvement">Improvements</TabsTrigger>
          <TabsTrigger value="trend">Trends</TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          <AIRecommendationsSection recommendations={recommendations} />
          <InsightsList insights={insights} activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
