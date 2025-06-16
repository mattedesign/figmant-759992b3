
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { InsightData } from '../types/dashboard';

interface InsightRowTabletProps {
  insight: InsightData;
  index: number;
  onViewInsight: (insight: InsightData) => void;
  onMetricClick: (insight: InsightData, metricType: 'total' | 'running' | 'complete') => void;
}

export const InsightRowTablet: React.FC<InsightRowTabletProps> = ({
  insight,
  index,
  onViewInsight,
  onMetricClick
}) => {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
          index === 0 ? 'bg-yellow-500' : 
          index === 1 ? 'bg-orange-500' :
          index === 2 ? 'bg-blue-500' :
          index === 3 ? 'bg-gray-500' : 'bg-purple-500'
        }`}>
          {insight.name.split(' ')[1].slice(-1)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{insight.name}</div>
          <div className="text-xs text-gray-500 truncate">{insight.role}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <button 
          className="text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => onMetricClick(insight, 'total')}
        >
          {insight.total}
        </button>
        <button 
          className="text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => onMetricClick(insight, 'running')}
        >
          {insight.running}
        </button>
        <button 
          className="text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => onMetricClick(insight, 'complete')}
        >
          {insight.complete}
        </button>
        <div className="flex items-center gap-1">
          <div className="flex items-center text-green-600 font-medium">
            <TrendingUp className="h-3 w-3 mr-1" />
            {insight.change}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewInsight(insight)}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
