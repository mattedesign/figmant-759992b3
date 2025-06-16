
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { InsightData } from '../types/dashboard';

interface InsightRowMobileProps {
  insight: InsightData;
  index: number;
  onViewInsight: (insight: InsightData) => void;
  onMetricClick: (insight: InsightData, metricType: 'total' | 'running' | 'complete') => void;
}

export const InsightRowMobile: React.FC<InsightRowMobileProps> = ({
  insight,
  index,
  onViewInsight,
  onMetricClick
}) => {
  return (
    <div className="flex flex-col space-y-2 border border-gray-200 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 w-full">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          index === 0 ? 'bg-yellow-500' : 
          index === 1 ? 'bg-orange-500' :
          index === 2 ? 'bg-blue-500' :
          index === 3 ? 'bg-gray-500' : 'bg-purple-500'
        }`}>
          {insight.name.split(' ')[1].slice(-1)}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{insight.name}</div>
          <div className="text-xs text-gray-500">{insight.role}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center text-green-600 text-sm font-medium">
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
      <div className="flex justify-between w-full text-sm">
        <button 
          className="text-center hover:bg-blue-50 p-2 rounded transition-colors"
          onClick={() => onMetricClick(insight, 'total')}
        >
          <div className="text-gray-500 text-xs">Total</div>
          <div className="font-medium">{insight.total}</div>
        </button>
        <button 
          className="text-center hover:bg-blue-50 p-2 rounded transition-colors"
          onClick={() => onMetricClick(insight, 'running')}
        >
          <div className="text-gray-500 text-xs">Running</div>
          <div className="font-medium">{insight.running}</div>
        </button>
        <button 
          className="text-center hover:bg-blue-50 p-2 rounded transition-colors"
          onClick={() => onMetricClick(insight, 'complete')}
        >
          <div className="text-gray-500 text-xs">Complete</div>
          <div className="font-medium">{insight.complete}</div>
        </button>
        <div className="text-center">
          <div className="text-gray-500 text-xs">Period</div>
          <div className="text-xs">{insight.period}</div>
        </div>
      </div>
    </div>
  );
};
