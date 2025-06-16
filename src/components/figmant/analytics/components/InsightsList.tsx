
import React from 'react';
import { InsightCard } from './InsightCard';
import { InsightsEmptyState } from './InsightsEmptyState';
import { Insight } from '../types/insights';

interface InsightsListProps {
  insights: Insight[];
  activeTab: string;
}

export const InsightsList: React.FC<InsightsListProps> = ({ insights, activeTab }) => {
  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeTab);

  if (filteredInsights.length === 0) {
    return <InsightsEmptyState activeTab={activeTab} />;
  }

  return (
    <div className="space-y-4">
      {filteredInsights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};
