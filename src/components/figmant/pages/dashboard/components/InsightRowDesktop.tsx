
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { InsightData } from '../types/dashboard';

interface InsightRowDesktopProps {
  insight: InsightData;
  index: number;
  onViewInsight: (insight: InsightData) => void;
  onMetricClick: (insight: InsightData, metricType: 'total' | 'running' | 'complete') => void;
}

export const InsightRowDesktop: React.FC<InsightRowDesktopProps> = ({
  insight,
  index,
  onViewInsight,
  onMetricClick
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="col-span-3 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          index === 0 ? 'bg-yellow-500' : 
          index === 1 ? 'bg-orange-500' :
          index === 2 ? 'bg-blue-500' :
          index === 3 ? 'bg-gray-500' : 'bg-purple-500'
        }`}>
          {insight.name.split(' ')[1].slice(-1)}
        </div>
        <div>
          <div className="font-medium text-sm">{insight.name}</div>
          <div className="text-xs text-gray-500">{insight.role}</div>
        </div>
      </div>
      <button 
        className="col-span-2 text-center font-medium hover:text-blue-600 transition-colors"
        onClick={() => onMetricClick(insight, 'total')}
      >
        {insight.total}
      </button>
      <button 
        className="col-span-2 text-center font-medium hover:text-blue-600 transition-colors"
        onClick={() => onMetricClick(insight, 'running')}
      >
        {insight.running}
      </button>
      <button 
        className="col-span-2 text-center font-medium hover:text-blue-600 transition-colors"
        onClick={() => onMetricClick(insight, 'complete')}
      >
        {insight.complete}
      </button>
      <div className="col-span-3 flex items-center gap-2">
        <div className="flex items-center text-green-600 text-sm font-medium">
          <TrendingUp className="h-3 w-3 mr-1" />
          {insight.change}
        </div>
        <span className="text-xs text-gray-500">{insight.period}</span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewInsight(insight)}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
